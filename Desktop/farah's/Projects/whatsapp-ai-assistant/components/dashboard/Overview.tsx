import { MessageSquare, Users, Database, Zap, TrendingUp, MessageCircle } from 'lucide-react'

type ConversationRow = {
  id: string
  customer_phone: string
  message: string
  role: string
  created_at: string
}

type Props = {
  totalMessages: number
  totalChunks: number
  activeConversations: number
  responseRate: number | null
  recentConversations: ConversationRow[]
}

export default function Overview({ totalMessages, totalChunks, activeConversations, responseRate, recentConversations }: Props) {
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const stats = [
    {
      label: 'Total Messages',
      value: totalMessages.toLocaleString(),
      icon: MessageSquare,
      trend: undefined,
      iconBg: 'bg-green-100',
      iconColor: 'text-[#22c55e]',
    },
    {
      label: 'Active Conversations',
      value: activeConversations.toLocaleString(),
      icon: Users,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Knowledge Chunks',
      value: totalChunks.toLocaleString(),
      icon: Database,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      label: 'Response Rate',
      value: responseRate !== null ? `${responseRate}%` : '—',
      icon: Zap,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
  ]

  const isEmpty = recentConversations.length === 0

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      <header className="mb-8 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">Overview</h1>
          <p className="mt-1 text-sm text-slate-500">Welcome back, here's what's happening.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-slate-400">Live</span>
          </div>
          <p className="text-sm text-slate-500">{today}</p>
        </div>
      </header>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div
              key={s.label}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className={`rounded-lg p-2.5 ${s.iconBg}`}>
                  <Icon className={`h-5 w-5 ${s.iconColor}`} />
                </div>
                {s.trend && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-[#22c55e]">
                    <TrendingUp className="h-3 w-3" />
                    {s.trend}
                  </span>
                )}
              </div>
              <p className="mt-4 text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="mt-1 text-sm text-slate-500">{s.label}</p>
            </div>
          )
        })}
      </div>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Recent Messages</h2>
        </div>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <MessageCircle className="h-8 w-8 text-[#22c55e]" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Connect WhatsApp to get started</h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Link your WhatsApp Business account to start receiving and replying to messages with AI.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recentConversations.map((m) => (
              <li
                key={m.id}
                className="flex items-start gap-4 px-6 py-4 transition-colors hover:bg-slate-50"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900">{m.customer_phone}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        m.role === 'assistant'
                          ? 'bg-green-100 text-[#16a34a]'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {m.role === 'assistant' ? 'AI' : 'Customer'}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-slate-500">{m.message}</p>
                </div>
                <span className="shrink-0 text-xs text-slate-400">
                  {new Date(m.created_at).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
