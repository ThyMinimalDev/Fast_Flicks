import { useToast } from '@/components/ui/use-toast'
import { getSupabaseBrowserClient } from '@/lib/supabase'
import { Provider } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

export const useAuth = () => {
  const router = useRouter()
  const { toast } = useToast()
  const client = getSupabaseBrowserClient().auth

  const handleLogOut = async () => {
    await client.signOut()
    toast({
      title: 'Until Next Time!',
      description: 'You Are Now Signed Out 👋',
    })
    router.refresh()
  }

  const handleOAuth = (provider: Provider) => async () => {
    await client.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return { handleOAuth, handleLogOut }
}
