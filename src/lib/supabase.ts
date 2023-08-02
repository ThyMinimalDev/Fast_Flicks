import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// create singleton client side supabaseClient
export const supbaseClientComponentClient = (function () {
  const supabase = createClientComponentClient({ isSingleton: true })

  return supabase
})()
