import { NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/db/supabase'
import { redis } from '@/lib/memory/redis'

export async function GET() {
  const [redisResult, supabaseResult] = await Promise.allSettled([
    (async () => (await redis.ping()) === 'PONG')(),
    (async () => {
      const supabase = createSupabaseServiceClient()
      const { error } = await supabase.from('businesses').select('id').limit(1)
      return !error
    })(),
  ])

  const redisHealthy = redisResult.status === 'fulfilled' && redisResult.value
  const supabaseHealthy = supabaseResult.status === 'fulfilled' && supabaseResult.value
  const timestamp = new Date().toISOString()

  if (redisHealthy && supabaseHealthy) {
    return NextResponse.json({ status: 'ok', timestamp })
  }

  return NextResponse.json({
    status: 'degraded',
    timestamp,
    redis: redisHealthy,
    supabase: supabaseHealthy,
  })
}
