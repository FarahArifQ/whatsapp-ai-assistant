import { createSupabaseServiceClient } from '@/lib/db/supabase'
import Conversations from '@/components/dashboard/Conversations'

export default async function ConversationsPage() {
  const supabase = createSupabaseServiceClient()

  const { data: conversations } = await supabase
    .from('conversations')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  return <Conversations conversations={conversations ?? []} />
}
