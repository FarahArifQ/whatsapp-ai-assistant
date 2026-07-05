import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/db/supabase'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { generateEmbedding } from '@/lib/ai/embeddings'

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

async function getOrCreateBusiness(userId: string) {
  const supabase = createSupabaseServiceClient()

  // Check if business already exists for this user
  const { data: existing } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (existing) return existing

  // Create a new business for this user
  const { data: newBusiness, error } = await supabase
    .from('businesses')
    .insert({ user_id: userId, name: 'My Business' })
    .select()
    .single()

  if (error) throw error
  return newBusiness
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabaseAuth = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll() {}
        }
      }
    )

    const { data: { user } } = await supabaseAuth.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { text, fileName } = await req.json()

    if (!text) {
      return NextResponse.json(
        { error: 'text is required' },
        { status: 400 }
      )
    }

    // Get or create business for this user
    const business = await getOrCreateBusiness(user.id)

    const chunks = chunkText(text)
    const supabase = createSupabaseServiceClient()
    const inserts = []

    for (const chunk of chunks) {
      const embedding = await generateEmbedding(chunk)
      inserts.push({
        business_id: business.id,
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
      businessId: business.id,
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to process document' },
      { status: 500 }
    )
  }
}