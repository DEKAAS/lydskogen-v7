'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLanding() {
  const router = useRouter()

  useEffect(() => {
    router.push('/admin/dashboard')
  }, [router])

  return (
    <main className="min-h-screen bg-base-dark flex items-center justify-center">
      <div className="text-white">Redirecter til admin dashboard...</div>
    </main>
  );
}


