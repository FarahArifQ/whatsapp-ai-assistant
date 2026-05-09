'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Signup from '@/components/auth/Signup'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup() {
    setLoading(true)
    setError('')
    try {
      const { createSupabaseBrowserClient } = await import('@/lib/db/supabase')
      const supabase = createSupabaseBrowserClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })

      if (error) {
        setError(error.message)
        return
      }

      if (data.session) {
        router.push('/dashboard')
        router.refresh()
      } else {
        // No session means email confirmation is required
        setError('Please check your email to confirm your account')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Signup
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      error={error}
      loading={loading}
      onSignup={handleSignup}
    />
  )
}