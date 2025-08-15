import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

// Simple in-memory rate limiter per IP
const loginAttempts: Record<string, { count: number; first: number }> = {}
const WINDOW_MS = 5 * 60 * 1000 // 5 minutes
const MAX_ATTEMPTS = 10

const handler = NextAuth({
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
        const now = Date.now()
        const entry = loginAttempts[ip]
        if (!entry || now - entry.first > WINDOW_MS) {
          loginAttempts[ip] = { count: 1, first: now }
        } else {
          entry.count += 1
          if (entry.count > MAX_ATTEMPTS) {
            return null
          }
        }

        // Updated credentials
        if (credentials.username === "lydskog0307") {
          const isValid = credentials.password === "41gqn98jXX"
          if (isValid) {
            return {
              id: "admin",
              name: "Admin",
              email: "admin@lydskog.no",
              role: "admin"
            }
          }
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