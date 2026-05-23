import { createServerClient } from '@supabase/ssr'
import { createSupabaseServiceClient } from '@/lib/db/supabase'
import { cookies } from 'next/headers'
import Conversations from '@/components/dashboard/Conversations'

export default async function ConversationsPage() {
  const cookieStore = await cookies()
  const authClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {},
      },
    }
  )

  const { data: { user } } = await authClient.auth.getUser()

  if (!user) {
    return <Conversations conversations={[]} />
  }

  const supabase = createSupabaseServiceClient()

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!business) {
    return <Conversations conversations={[]} />
  }

  const { data: conversations } = await supabase
    .from('conversations')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false })
    .limit(50)

  return <Conversations conversations={conversations ?? []} />
}
