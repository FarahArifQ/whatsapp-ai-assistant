'use client'
import { useState, useEffect } from 'react'
import Conversations from './Conversations'

type ConversationRow = {
  id: string
  customer_phone: string
  message: string
  role: string
  created_at: string
}

export default function ConversationsLiveWrapper({ initial }: { initial: ConversationRow[] }) {
  const [conversations, setConversations] = useState<ConversationRow[]>(initial)

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch('/api/conversations')
        if (res.ok) {
          const data = await res.json()
          setConversations(data.conversations)
        }
      } catch {
        // keep showing last known data on network error
      }
    }

    const id = setInterval(poll, 10_000)
    return () => clearInterval(id)
  }, [])

  return <Conversations conversations={conversations} />
}
