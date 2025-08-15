'use client'

import { signIn, getSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    const session = await getSession()
    if (session?.user?.role === 'admin') {
      router.push('/admin/dashboard')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Ugyldig brukernavn eller passord')
      } else {
        router.push('/admin/dashboard')
      }
    } catch (error) {
      setError('Det oppstod en feil ved innlogging')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-base-dark flex items-center justify-center p-4">
      <div className="bg-secondary-dark p-8 rounded-lg shadow-lg w-full max-w-md border border-white/10">
        <button
          onClick={() => (window.location.href = '/')}
          className="mb-6 text-sm px-3 py-1 rounded border border-white/20 text-white/80 hover:text-white hover:bg-white/10"
        >
          ← Tilbake til forsiden
        </button>
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Admin Innlogging
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-gray-300 mb-2">
              Brukernavn
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 bg-base-dark text-white rounded border border-gray-600 focus:border-accent-green focus:outline-none"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-gray-300 mb-2">
              Passord
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-base-dark text-white rounded border border-gray-600 focus:border-accent-green focus:outline-none"
              required
            />
          </div>
          
          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent-green text-white p-3 rounded hover:bg-accent-green/80 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Logger inn...' : 'Logg inn'}
          </button>
        </form>
      </div>
    </div>
  )
}