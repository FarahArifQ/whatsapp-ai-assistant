import { NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/db/supabase'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET() {
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

    const supabase = createSupabaseServiceClient()

    const { data: business } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    const { data: chunks, error } = await supabase
      .from('knowledge_chunks')
      .select('metadata, created_at')
      .eq('business_id', business.id)

    if (error) throw error

    const groups = new Map<string, { chunkCount: number; uploadDate: string }>()
    for (const chunk of chunks ?? []) {
      const fileName: string = chunk.metadata?.fileName ?? 'Unknown'
      if (!groups.has(fileName)) {
        groups.set(fileName, { chunkCount: 0, uploadDate: chunk.created_at })
      }
      const group = groups.get(fileName)!
      group.chunkCount++
      if (chunk.created_at < group.uploadDate) {
        group.uploadDate = chunk.created_at
      }
    }

    const documents = Array.from(groups.entries()).map(([fileName, { chunkCount, uploadDate }]) => ({
      fileName,
      chunkCount,
      uploadDate,
    }))

    return NextResponse.json({ documents })
  } catch (error) {
    console.error('List error:', error)
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
  }
}
