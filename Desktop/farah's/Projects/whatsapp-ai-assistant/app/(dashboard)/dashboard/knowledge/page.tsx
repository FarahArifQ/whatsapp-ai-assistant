'use client'
import KnowledgeBase from '@/components/dashboard/KnowledgeBase'

export default function KnowledgePage() {
  async function handleUpload(
    text: string,
    fileName: string
  ): Promise<{ success: boolean; chunksCreated?: number; error?: string }> {
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
        return { success: true, chunksCreated: data.chunksCreated }
      }
      return { success: false, error: data.error }
    } catch {
      return { success: false, error: 'Something went wrong' }
    }
  }

  return <KnowledgeBase onUpload={handleUpload} />
}
