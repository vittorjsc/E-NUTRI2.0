'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function Home() {
  const router = useRouter()
  const { professional, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (professional) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }
  }, [professional, loading, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  )
}

