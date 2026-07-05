'use client'
import { useState, useEffect } from 'react'
import Overview from './Overview'

type ConversationRow = {
  id: string
  customer_phone: string
  message: string
  role: string
  created_at: string
}

type Stats = {
  totalMessages: number
  totalChunks: number
  activeConversations: number
  responseRate: number | null
  recentConversations: ConversationRow[]
}

export default function OverviewLiveWrapper({ initial }: { initial: Stats }) {
  const [stats, setStats] = useState<Stats>(initial)

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch('/api/dashboard/stats')
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      } catch {
        // keep displaying last known stats on network error
      }
    }

    const id = setInterval(poll, 10_000)
    return () => clearInterval(id)
  }, [])

  return <Overview {...stats} />
}
