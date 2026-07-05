import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/db/supabase'
import { generateEmbedding } from '@/lib/ai/embeddings'

export async function POST(req: NextRequest) {
  try {
    const { query, businessId } = await req.json()

    if (!query || !businessId) {
      return NextResponse.json(
        { error: 'query and businessId are required' },
        { status: 400 }
      )
    }

    const embedding = await generateEmbedding(query)
    const supabase = createSupabaseServiceClient()

    const { data, error } = await supabase.rpc('match_knowledge', {
      query_embedding: embedding,
      match_count: 5,
      p_business_id: businessId,
    })

    if (error) throw error

    return NextResponse.json({ results: data })

  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}
