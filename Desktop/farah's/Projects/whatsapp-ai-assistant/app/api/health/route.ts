import { NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/db/supabase'

export async function GET() {
  try {
    const supabase = createSupabaseServiceClient()
    await supabase.from('businesses').select('count').limit(1)
    return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() })
  } catch {
    return NextResponse.json({ status: 'error' }, { status: 500 })
  }
}