import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold text-slate-900">404</h1>
      <p className="text-slate-500">Page not found</p>
      <Link
        href="/dashboard"
        className="rounded-lg bg-[#0f172a] px-4 py-2 text-sm text-white hover:bg-slate-800"
      >
        Go to Dashboard
      </Link>
    </div>
  )
}
