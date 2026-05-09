'use client'
import { useState } from 'react'
import { Copy, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>
      {children}
    </div>
  )
}

export default function Settings() {
  const [phoneId, setPhoneId] = useState('')
  const [apiToken, setApiToken] = useState('')
  const [verifyToken, setVerifyToken] = useState('whatsapp_secret_123')
  const [showToken, setShowToken] = useState(false)
  const [savingWa, setSavingWa] = useState(false)
  const [savedWa, setSavedWa] = useState(false)

  const [botName, setBotName] = useState('Assistant')
  const [tone, setTone] = useState<'Professional' | 'Friendly' | 'Formal'>('Friendly')
  const [prompt, setPrompt] = useState(
    'You are a helpful business assistant. Answer questions based on the provided knowledge base only.'
  )
  const [savingBot, setSavingBot] = useState(false)

  const copy = (val: string) => {
    if (typeof navigator !== 'undefined') navigator.clipboard?.writeText(val)
  }

  const saveWa = () => {
    setSavingWa(true)
    setSavedWa(false)
    setTimeout(() => {
      setSavingWa(false)
      setSavedWa(true)
      setTimeout(() => setSavedWa(false), 3000)
    }, 1000)
  }

  const saveBot = () => {
    setSavingBot(true)
    setTimeout(() => setSavingBot(false), 1000)
  }

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your WhatsApp connection and bot persona</p>
      </header>

      {savedWa && (
        <div className="fixed right-6 top-6 z-50 flex items-center gap-2 rounded-lg bg-[#22c55e] px-4 py-3 text-sm font-medium text-white shadow-lg">
          <CheckCircle2 className="h-4 w-4" />
          Settings saved successfully
        </div>
      )}

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">WhatsApp Configuration</h2>
        <p className="mt-1 text-sm text-slate-500">Connect your WhatsApp Business API credentials</p>

        <div className="mt-6 space-y-4">
          <Field label="Phone Number ID">
            <div className="flex gap-2">
              <input
                value={phoneId}
                onChange={(e) => setPhoneId(e.target.value)}
                placeholder="From Meta Developer Dashboard"
                className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-green-100"
              />
              <button
                type="button"
                onClick={() => copy(phoneId)}
                className="rounded-lg border border-slate-300 bg-white p-2 text-slate-600 transition-colors hover:bg-slate-50"
                aria-label="Copy"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </Field>

          <Field label="API Token">
            <div className="flex gap-2">
              <input
                type={showToken ? 'text' : 'password'}
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                placeholder="Your Meta API token"
                className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-green-100"
              />
              <button
                type="button"
                onClick={() => setShowToken((v) => !v)}
                className="rounded-lg border border-slate-300 bg-white p-2 text-slate-600 transition-colors hover:bg-slate-50"
                aria-label="Toggle visibility"
              >
                {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </Field>

          <Field label="Verify Token">
            <div className="flex gap-2">
              <input
                value={verifyToken}
                onChange={(e) => setVerifyToken(e.target.value)}
                className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-green-100"
              />
              <button
                type="button"
                onClick={() => copy(verifyToken)}
                className="rounded-lg border border-slate-300 bg-white p-2 text-slate-600 transition-colors hover:bg-slate-50"
                aria-label="Copy"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </Field>

          <button
            type="button"
            onClick={saveWa}
            disabled={savingWa}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0f172a] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
          >
            {savingWa && <Loader2 className="h-4 w-4 animate-spin" />}
            {savingWa ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Bot Persona</h2>
        <p className="mt-1 text-sm text-slate-500">Customize how your AI assistant responds to customers</p>

        <div className="mt-6 space-y-4">
          <Field label="Bot name">
            <input
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-green-100"
            />
          </Field>

          <Field label="Tone">
            <div className="flex flex-wrap gap-2">
              {(['Professional', 'Friendly', 'Formal'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                    tone === t
                      ? 'border-[#22c55e] bg-green-50 text-[#16a34a]'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </Field>

          <Field label="System prompt">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={8}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-green-100"
            />
            <p className="mt-1 text-right text-xs text-slate-400">{prompt.length} / 2000 characters</p>
          </Field>

          <button
            type="button"
            onClick={saveBot}
            disabled={savingBot}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0f172a] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
          >
            {savingBot && <Loader2 className="h-4 w-4 animate-spin" />}
            {savingBot ? 'Saving...' : 'Save Persona'}
          </button>
        </div>
      </div>
    </div>
  )
}
