import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { supabaseAdmin } from '@/lib/supabase'

// Simple in-memory rate limiter per IP
const loginAttempts: Record<string, { count: number; first: number }> = {}
const WINDOW_MS = 5 * 60 * 1000 // 5 minutes
const MAX_ATTEMPTS = 5 // Reduced from 10 to 5

// Log login attempt to database
async function logLoginAttempt(ip: string, username: string, success: boolean, userAgent: string) {
  try {
    await supabaseAdmin.from('login_attempts').insert({
      ip_address: ip,
      username_attempted: username,
      success,
      user_agent: userAgent,
    })
  } catch (error) {
    console.error('Failed to log login attempt:', error)
  }
}

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        // Rate limiting by IP
        const ip = (req?.headers?.["x-forwarded-for"] as string)?.split(",")[0]?.trim() || "unknown"
        const userAgent = (req?.headers?.["user-agent"] as string) || "unknown"
        const now = Date.now()
        const entry = loginAttempts[ip]
        
        if (!entry || now - entry.first > WINDOW_MS) {
          loginAttempts[ip] = { count: 1, first: now }
        } else {
          entry.count += 1
          if (entry.count > MAX_ATTEMPTS) {
            // Log blocked attempt
            await logLoginAttempt(ip, credentials.username, false, userAgent + ' [RATE_LIMITED]')
            return null
          }
        }

        // Check environment variables for credentials
        const adminUsername = process.env.ADMIN_USERNAME || "lydskog0307"
        const adminPassword = process.env.ADMIN_PASSWORD || "41gqn98jXX"
        
        if (credentials.username === adminUsername) {
          const isValid = credentials.password === adminPassword
          
          // Log the attempt
          await logLoginAttempt(ip, credentials.username, isValid, userAgent)
          
          if (isValid) {
            // Reset rate limit on successful login
            delete loginAttempts[ip]
            return {
              id: "admin",
              name: "Admin",
              email: "admin@lydskog.no",
              role: "admin"
            }
          }
        } else {
          // Log failed attempt with wrong username
          await logLoginAttempt(ip, credentials.username, false, userAgent)
        }

        return null
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? `__Secure-next-auth.session-token` : `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      }
    }
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: '/admin/login',
  },
})

export { handler as GET, handler as POST }