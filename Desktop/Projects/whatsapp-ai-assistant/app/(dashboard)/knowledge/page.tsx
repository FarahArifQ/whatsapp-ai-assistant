'use client'
import { useState } from 'react'
import KnowledgeBase from '@/components/dashboard/KnowledgeBase'

export default function KnowledgePage() {
  const [text, setText] = useState('')
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  async function handleUpload() {
    if (!text.trim()) return
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/knowledge/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          fileName: fileName || 'manual-entry',
        }),
      })

      const data = await res.json()

      if (data.success) {
        setResult(`Successfully created ${data.chunksCreated} knowledge chunks`)
        setText('')
        setFileName('')
      } else {
        setResult(`Error: ${data.error}`)
      }
    } catch {
      setResult('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KnowledgeBase
      text={text}
      setText={setText}
      fileName={fileName}
      setFileName={setFileName}
      loading={loading}
      result={result}
      onUpload={handleUpload}
    />
  )
}