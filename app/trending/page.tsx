'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function TrendingPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/leaderboards')
  }, [router])

  return (
    <div className="min-h-screen bg-[#FBF6EE] flex items-center justify-center">
      <div className="animate-pulse text-center">
        <div className="w-12 h-12 rounded-full bg-[#F5EDD9] mx-auto mb-4" />
        <div className="h-4 bg-[#F5EDD9] rounded w-48 mx-auto" />
      </div>
    </div>
  )
}
