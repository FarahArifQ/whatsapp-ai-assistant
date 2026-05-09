'use client'
import { useState } from 'react'
import { MessageSquare } from 'lucide-react'

type ConversationRow = {
  id: string
  customer_phone: string
  message: string
  role: string
  created_at: string
}

type Props = {
  conversations: ConversationRow[]
}

export default function Conversations({ conversations }: Props) {
  const grouped: Record<string, ConversationRow[]> = {}
  conversations.forEach((msg) => {
    if (!grouped[msg.customer_phone]) grouped[msg.customer_phone] = []
    grouped[msg.customer_phone].push(msg)
  })

  const phones = Object.keys(grouped)
  const [activePhone, setActivePhone] = useState<string | null>(phones[0] ?? null)
  const activeMessages = activePhone ? grouped[activePhone] ?? [] : []

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 0px)' }}>
      <header className="border-b border-slate-200 bg-white px-4 py-4 md:px-8">
        <h1 className="text-2xl font-bold text-slate-900">Conversations</h1>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden md:grid-cols-3">
        <aside className="border-r border-slate-200 bg-white md:col-span-1 overflow-y-auto">
          {phones.length === 0 ? (
            <p className="px-4 py-6 text-sm text-slate-400">No conversations yet.</p>
          ) : (
            phones.map((phone) => {
              const msgs = grouped[phone]!
              const last = msgs[msgs.length - 1]
              const isActive = phone === activePhone
              return (
                <button
                  key={phone}
                  type="button"
                  onClick={() => setActivePhone(phone)}
                  className={`flex w-full items-start gap-3 border-b border-slate-100 px-4 py-3.5 text-left transition-colors ${
                    isActive ? 'bg-green-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
                    {phone.slice(-2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">{phone}</p>
                    <p className="truncate text-xs text-slate-500">{last?.message}</p>
                  </div>
                </button>
              )
            })
          )}
        </aside>

        <section className="flex flex-col overflow-hidden bg-slate-50 md:col-span-2">
          {activePhone ? (
            <>
              <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
                  {activePhone.slice(-2)}
                </div>
                <p className="truncate text-sm font-semibold text-slate-900">{activePhone}</p>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto p-6">
                {activeMessages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.role === 'assistant' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                        m.role === 'assistant'
                          ? 'rounded-br-sm bg-[#0f172a] text-white'
                          : 'rounded-bl-sm bg-white text-slate-900'
                      }`}
                    >
                      <p>{m.message}</p>
                      <p className="mt-1 text-[10px] text-slate-400" suppressHydrationWarning>
                        {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-200">
                <MessageSquare className="h-8 w-8 text-slate-500" />
              </div>
              <p className="text-sm font-medium text-slate-700">Select a conversation to view messages</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
