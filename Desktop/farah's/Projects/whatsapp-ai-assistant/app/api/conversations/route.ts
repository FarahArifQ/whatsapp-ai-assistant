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
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const serviceSupabase = createSupabaseServiceClient()

    const { data: business } = await serviceSupabase
      .from('businesses')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!business) return NextResponse.json({ conversations: [] })

    const { data: conversations, error } = await serviceSupabase
      .from('conversations')
      .select('*')
      .eq('business_id', business.id)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) throw error

    return NextResponse.json({ conversations: conversations ?? [] })
  } catch (error) {
    console.error('Conversations fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 })
  }
}
