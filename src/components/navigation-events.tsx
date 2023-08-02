// https://nextjs.org/docs/app/api-reference/functions/use-router#router-events

'use client'

import { useEffect } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useToast } from './ui/use-toast'

export function NavigationEvents() {
  const { toast } = useToast()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  useEffect(() => {
    const auth = `${searchParams.get('auth')}`
    if (searchParams.has('auth') && auth) {
      toast({
        title: 'Welcome Back!',
        description: 'You Are Now Signed In ✅',
      })
      router.replace('/')
    }
  }, [pathname, router, searchParams, toast])

  return <></>
}

/**
 * Good to know: <NavigationEvents> is wrapped in a Suspense boundary becauseuse
 * SearchParams() causes client-side rendering up to the closest Suspense boundary during static rendering.
 */
