'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, MessageCircle } from 'lucide-react'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
)

type Props = {
  email: string
  setEmail: (v: string) => void
  password: string
  setPassword: (v: string) => void
  error: string
  loading: boolean
  onLogin: () => void
  onGoogleLogin: () => void
}

export default function Login({ email, setEmail, password, setPassword, error, loading, onLogin, onGoogleLogin }: Props) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.12),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(15,23,42,0.08),transparent_45%)]"
      />

      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#22c55e]">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">WA Assistant</span>
          </div>
          <p className="text-sm text-slate-500">Sign in to your business dashboard</p>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-500">{error}</p>
        )}

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                placeholder="you@business.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-[#22c55e] focus:ring-2 focus:ring-green-100"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type={show ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-sm outline-none transition-colors focus:border-[#22c55e] focus:ring-2 focus:ring-green-100"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Toggle password visibility"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogin}
            disabled={loading}
            className="w-full rounded-lg bg-[#0f172a] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs uppercase tracking-wider text-slate-400">or</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <button
          type="button"
          onClick={onGoogleLogin}
          disabled={loading}
          className="mb-6 flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <p className="text-center text-sm text-slate-600">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium text-[#16a34a] hover:underline">
            Get started free
          </Link>
        </p>
      </div>
    </div>
  )
}
