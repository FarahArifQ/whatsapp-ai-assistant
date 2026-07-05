import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createSupabaseServiceClient } from '@/lib/db/supabase'
import Overview from '@/components/dashboard/Overview'

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

  if (!business) return { totalMessages: 0, totalChunks: 0, recentConversations: [] }

  const { count: totalMessages } = await serviceSupabase
    .from('conversations')
    .select('*', { count: 'exact', head: true })
    .eq('business_id', business.id)

  const { count: totalChunks } = await serviceSupabase
    .from('knowledge_chunks')
    .select('*', { count: 'exact', head: true })
    .eq('business_id', business.id)

  const { data: recentConversations } = await serviceSupabase
    .from('conversations')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return { totalMessages, totalChunks, recentConversations }
}

export default async function DashboardPage() {
  const stats = await getBusinessAndStats()

  return (
    <Overview
      totalMessages={stats?.totalMessages ?? 0}
      totalChunks={stats?.totalChunks ?? 0}
      recentConversations={stats?.recentConversations ?? []}
    />
  )
}
