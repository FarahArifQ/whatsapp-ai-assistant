import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createSupabaseServiceClient } from '@/lib/db/supabase'
import OverviewLiveWrapper from '@/components/dashboard/OverviewLiveWrapper'

async function getBusinessAndStats() {
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
  if (!user) return null

  const serviceSupabase = createSupabaseServiceClient()

  const { data: business } = await serviceSupabase
    .from('businesses')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!business) {
    return {
      totalMessages: 0,
      totalChunks: 0,
      activeConversations: 0,
      responseRate: null,
      recentConversations: [],
    }
  }

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  const [
    { count: totalMessages },
    { count: totalChunks },
    { data: activeData },
    { count: assistantCount },
    { count: customerCount },
    { data: recentConversations },
  ] = await Promise.all([
    serviceSupabase
      .from('conversations')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', business.id),
    serviceSupabase
      .from('knowledge_chunks')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', business.id),
    serviceSupabase
      .from('conversations')
      .select('customer_phone')
      .eq('business_id', business.id)
      .gte('created_at', oneDayAgo),
    serviceSupabase
      .from('conversations')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', business.id)
      .eq('role', 'assistant'),
    serviceSupabase
      .from('conversations')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', business.id)
      .eq('role', 'customer'),
    serviceSupabase
      .from('conversations')
      .select('*')
      .eq('business_id', business.id)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const activeConversations = new Set(
    (activeData ?? []).map((r: { customer_phone: string }) => r.customer_phone)
  ).size

  const responseRate =
    customerCount && customerCount > 0
      ? Math.round(((assistantCount ?? 0) / customerCount) * 100)
      : null

  return {
    totalMessages: totalMessages ?? 0,
    totalChunks: totalChunks ?? 0,
    activeConversations,
    responseRate,
    recentConversations: recentConversations ?? [],
  }
}

export default async function DashboardPage() {
  const stats = await getBusinessAndStats()

  return (
    <OverviewLiveWrapper
      initial={{
        totalMessages: stats?.totalMessages ?? 0,
        totalChunks: stats?.totalChunks ?? 0,
        activeConversations: stats?.activeConversations ?? 0,
        responseRate: stats?.responseRate ?? null,
        recentConversations: stats?.recentConversations ?? [],
      }}
    />
  )
}
