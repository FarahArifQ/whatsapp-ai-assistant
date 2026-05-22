'use client'
import KnowledgeBase from '@/components/dashboard/KnowledgeBase'

export default function KnowledgePage() {
  async function handleUpload(text: string, fileName: string): Promise<{ success: boolean; chunksCreated?: number; error?: string }> {
    if (!text.trim()) return { success: false, error: 'No text provided' }

    try {
      const res = await fetch('/api/knowledge/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          fileName: fileName || 'manual-entry',
          businessId: '00000000-0000-0000-0000-000000000001',
        }),
      })
      return res.json()
    } catch {
      return { success: false, error: 'Something went wrong' }
    }
  }

  return <KnowledgeBase onUpload={handleUpload} />
}
