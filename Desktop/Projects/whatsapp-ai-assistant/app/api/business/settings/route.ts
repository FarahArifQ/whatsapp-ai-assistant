import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/db/supabase'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

async function getUser() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {}
      }
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

async function getOrCreateBusiness(userId: string) {
  const supabase = createSupabaseServiceClient()
  const { data: existing } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (existing) return existing

  const { data: newBusiness, error } = await supabase
    .from('businesses')
    .insert({ user_id: userId, name: 'My Business' })
    .select()
    .single()

  if (error) throw error
  return newBusiness
}

export async function GET() {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const business = await getOrCreateBusiness(user.id)
    return NextResponse.json({ business })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const updates = await req.json()
    const business = await getOrCreateBusiness(user.id)

    const supabase = createSupabaseServiceClient()
    const { error } = await supabase
      .from('businesses')
      .update(updates)
      .eq('id', business.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
