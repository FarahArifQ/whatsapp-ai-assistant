import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/db/supabase'
import { generateEmbedding } from '@/lib/ai/embeddings'

// Splits text into overlapping chunks so context isn't lost at boundaries
function chunkText(text: string, chunkSize = 500, overlap = 50): string[] {
  const chunks: string[] = []
  let start = 0
  while (start < text.length) {
    const end = start + chunkSize
    chunks.push(text.slice(start, end))
    start = end - overlap
  }
  return chunks
}

export async function POST(req: NextRequest) {
  try {
    const { text, businessId, fileName } = await req.json()

    if (!text || !businessId) {
      return NextResponse.json(
        { error: 'text and businessId are required' },
        { status: 400 }
      )
    }

    // Split the document into chunks
    const chunks = chunkText(text)

    // Generate embedding for each chunk and save to Supabase
    const supabase = createSupabaseServiceClient()
    const inserts = []

    for (const chunk of chunks) {
      const embedding = await generateEmbedding(chunk)
      inserts.push({
        business_id: businessId,
        content: chunk,
        embedding,
        metadata: { fileName },
      })
    }

    const { error } = await supabase
      .from('knowledge_chunks')
      .insert(inserts)

    if (error) throw error

    return NextResponse.json({
      success: true,
      chunksCreated: inserts.length,
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to process document' },
      { status: 500 }
    )
  }
}
