'use server'

import { getSupabaseServerClient } from '@/lib/supabase-server'

export async function getSession() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null
  return { user }
}
