import { createSupabaseBrowserClient } from './supabase'

export async function signUp(email: string, password: string) {
  const supabase = createSupabaseBrowserClient()
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data
}

export async function signIn(email: string, password: string) {
  const supabase = createSupabaseBrowserClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  const supabase = createSupabaseBrowserClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getSession() {
  const supabase = createSupabaseBrowserClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}
