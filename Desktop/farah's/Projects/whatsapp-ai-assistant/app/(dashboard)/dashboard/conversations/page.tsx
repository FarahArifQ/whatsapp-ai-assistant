import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createSupabaseServiceClient } from '@/lib/db/supabase'
import Conversations from '@/components/dashboard/Conversations'

async function getConversations() {
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
  if (!user) return []

  const serviceSupabase = createSupabaseServiceClient()

  const { data: business } = await serviceSupabase
    .from('businesses')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!business) return []

  const { data: conversations } = await serviceSupabase
    .from('conversations')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false })
    .limit(100)

  return conversations ?? []
}

export default async function ConversationsPage() {
  const conversations = await getConversations()
  return <Conversations conversations={conversations} />
}
