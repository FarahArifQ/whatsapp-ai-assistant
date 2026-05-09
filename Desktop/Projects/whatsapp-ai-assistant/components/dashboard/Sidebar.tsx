'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Database, MessageSquare, Settings, LogOut, MessageCircle, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/dashboard/knowledge', label: 'Knowledge Base', icon: Database },
  { to: '/dashboard/conversations', label: 'Conversations', icon: MessageSquare },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const [open, setOpen] = useState(false)
  const [userEmail, setUserEmail] = useState('My Business')
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
  async function getUser() {
    try {
      const response = await fetch('/api/me')
      const data = await response.json()
      if (data.email) setUserEmail(data.email)
    } catch (e) {
      console.log('could not get user', e)
    }
  }
  getUser()
}, [])

  async function handleLogout() {
    const { createSupabaseBrowserClient } = await import('@/lib/db/supabase')
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const content = (
    <div className="flex h-full flex-col bg-[#0f172a] text-slate-200">
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#22c55e]">
          <MessageCircle className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-semibold text-white">WA Assistant</span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const active = pathname === item.to
          const Icon = item.icon
          return (
            <Link
              key={item.to}
              href={item.to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-[#22c55e] text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-sm font-semibold text-white">
            {userEmail.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">
              {userEmail}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#22c55e]">
            <MessageCircle className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-slate-900">WA Assistant</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-md p-2 text-slate-700 hover:bg-slate-100"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <aside className="hidden w-64 shrink-0 md:block">{content}</aside>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-2 top-2 z-10 rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            {content}
          </div>
        </div>
      )}
    </>
  )
}