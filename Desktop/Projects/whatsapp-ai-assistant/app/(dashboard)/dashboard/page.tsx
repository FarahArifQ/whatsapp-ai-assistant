import { createSupabaseServiceClient } from '@/lib/db/supabase'
import Overview from '@/components/dashboard/Overview'

async function getStats() {
  const supabase = createSupabaseServiceClient()

  const { count: totalMessages } = await supabase
    .from('conversations')
    .select('*', { count: 'exact', head: true })

  const { count: totalChunks } = await supabase
    .from('knowledge_chunks')
    .select('*', { count: 'exact', head: true })

  const { data: recentConversations } = await supabase
    .from('conversations')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  return { totalMessages, totalChunks, recentConversations }
}

export default async function DashboardPage() {
  const { totalMessages, totalChunks, recentConversations } = await getStats()

  return (
    <Overview
      totalMessages={totalMessages ?? 0}
      totalChunks={totalChunks ?? 0}
      recentConversations={recentConversations ?? []}
    />
  )
}
