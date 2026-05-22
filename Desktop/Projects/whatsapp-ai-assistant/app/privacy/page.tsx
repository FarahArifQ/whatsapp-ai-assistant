export default function PrivacyPage() {
  const sections = [
    {
      title: 'What we collect',
      icon: '📋',
      content:
        'We collect WhatsApp messages sent to business numbers using our service, business account information, and usage data to improve our service.',
    },
    {
      title: 'How we use your data',
      icon: '🔒',
      content:
        'Message data is used solely to generate AI responses. We do not sell your data to third parties.',
    },
    {
      title: 'Data retention',
      icon: '🕐',
      content:
        'Conversation history is stored for 24 hours for context purposes only.',
    },
    {
      title: 'Contact',
      icon: '✉️',
      content: 'For privacy concerns email: faraharifqureshi@gmail.com',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 mb-6">
            <span className="text-3xl">🛡️</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Privacy Policy</h1>
          <p className="text-slate-400 text-sm">Last updated: May 2026</p>
        </div>

        {/* Intro card */}
        <div className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6 mb-6 backdrop-blur-sm">
          <p className="text-slate-300 leading-relaxed">
            At <span className="text-green-400 font-medium">WA Assistant</span>, we take your privacy seriously.
            This policy explains how we handle data when you use our WhatsApp AI assistant service.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section.title}
              className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm transition-colors hover:border-slate-600"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-700/60 text-xl">
                  {section.icon}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white mb-2">{section.title}</h2>
                  <p className="text-slate-400 leading-relaxed text-sm">{section.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <a
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-green-500/20 transition-all hover:bg-green-400 hover:shadow-green-400/30"
          >
            ← Back to App
          </a>
          <p className="mt-6 text-xs text-slate-600">
            © 2026 WA Assistant. All rights reserved.
          </p>
        </div>

      </div>
    </div>
  )
}
