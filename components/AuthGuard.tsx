'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    if (!sessionStorage.getItem('gsoc_authed')) {
      router.replace('/')
    }
  }, [router])

  return <>{children}</>
}