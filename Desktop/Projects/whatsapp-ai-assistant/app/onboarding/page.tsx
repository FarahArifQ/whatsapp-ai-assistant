'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, BookOpen, CheckCircle2, ChevronRight, Upload, Loader2 } from 'lucide-react'

const BUSINESS_TYPES = ['Clothing', 'Restaurant', 'Clinic', 'Tutoring', 'Other']

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  // Step 1
  const [businessName, setBusinessName] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [savingBusiness, setSavingBusiness] = useState(false)

  // Step 2
  const [docName, setDocName] = useState('')
  const [docContent, setDocContent] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadDone, setUploadDone] = useState(false)
  const [uploadError, setUploadError] = useState('')

  async function handleSaveBusiness() {
    if (!businessName.trim()) return
    setSavingBusiness(true)
    try {
      await fetch('/api/business/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: businessName, type: businessType }),
      })
    } catch {
      // non-blocking
    } finally {
      setSavingBusiness(false)
      setStep(2)
    }
  }

  async function handleUpload() {
    if (!docContent.trim()) return
    setUploading(true)
    setUploadError('')
    try {
      const res = await fetch('/api/knowledge/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: docContent,
          fileName: docName || 'Getting Started',
          businessId: '00000000-0000-0000-0000-000000000001',
        }),
      })
      const data = await res.json()
      if (data.success) {
        setUploadDone(true)
        setTimeout(() => setStep(3), 800)
      } else {
        setUploadError(data.error ?? 'Upload failed')
      }
    } catch {
      setUploadError('Something went wrong')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#0f172a] mb-3">
            <span className="text-[#22c55e] text-xl font-bold">W</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">WA Assistant</h1>
          <p className="text-sm text-slate-500 mt-1">Set up your AI assistant in minutes</p>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex flex-col gap-1.5">
              <div className={`h-1.5 rounded-full transition-all duration-500 ${
                s <= step ? 'bg-[#22c55e]' : 'bg-slate-200'
              }`} />
              <p className={`text-[10px] font-medium text-center ${
                s === step ? 'text-slate-700' : 'text-slate-400'
              }`}>
                {s === 1 ? 'Business Info' : s === 2 ? 'Knowledge Base' : 'All Set!'}
              </p>
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8">

          {/* Step 1 */}
          {step === 1 && (
            <div>
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 mb-5 mx-auto">
                <Building2 className="h-6 w-6 text-slate-700" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 text-center mb-1">Tell us about your business</h2>
              <p className="text-sm text-slate-500 text-center mb-6">We'll personalise your AI assistant.</p>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Business name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Zara Boutique"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-green-100 transition-colors"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Business type</label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-green-100 transition-colors bg-white"
                  >
                    <option value="">Select a type...</option>
                    {BUSINESS_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveBusiness}
                disabled={!businessName.trim() || savingBusiness}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#0f172a] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {savingBusiness && <Loader2 className="h-4 w-4 animate-spin" />}
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 mb-5 mx-auto">
                <BookOpen className="h-6 w-6 text-slate-700" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 text-center mb-1">What should your AI know?</h2>
              <p className="text-sm text-slate-500 text-center mb-6">Paste your FAQs, product info, delivery details, or policies.</p>

              <div className="space-y-3">
                <input
                  type="text"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="Document name (e.g. Product Catalog)"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-green-100 transition-colors"
                />
                <textarea
                  value={docContent}
                  onChange={(e) => setDocContent(e.target.value)}
                  placeholder="Paste your business info here..."
                  rows={6}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-green-100 transition-colors resize-none"
                />
              </div>

              {uploadError && <p className="mt-2 text-xs text-red-500">{uploadError}</p>}

              {uploadDone && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-[#16a34a]">
                  <CheckCircle2 className="h-4 w-4" /> Uploaded successfully!
                </div>
              )}

              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading || !docContent.trim() || uploadDone}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#0f172a] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {uploading
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</>
                  : <><Upload className="h-4 w-4" /> Upload Document</>}
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="mt-3 w-full text-xs text-slate-400 hover:text-slate-600 transition-colors"
              >
                Skip for now →
              </button>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="relative flex items-center justify-center w-20 h-20">
                  <div className="absolute inset-0 rounded-full bg-green-100 animate-ping opacity-30" />
                  <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-green-50 border-2 border-[#22c55e]">
                    <CheckCircle2 className="h-10 w-10 text-[#22c55e]" />
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-2">Your AI assistant is ready!</h2>
              {businessName && (
                <p className="text-sm font-semibold text-[#22c55e] mb-4">{businessName}</p>
              )}

              <div className="rounded-xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm text-left mb-6">
                <p className="font-semibold text-blue-800 mb-1">📱 WhatsApp connection</p>
                <p className="text-blue-600 leading-relaxed">
                  Our team will connect your WhatsApp number within 24 hours.
                  You'll receive a confirmation message on WhatsApp once it's live.
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#22c55e] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-green-500/20 transition-colors hover:bg-green-400"
              >
                Go to Dashboard <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Already set up?{' '}
          <a href="/dashboard" className="text-[#22c55e] hover:underline">Go to dashboard</a>
        </p>
      </div>
    </div>
  )
}
