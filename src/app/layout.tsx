import './globals.css'
import type { Metadata } from 'next'
import { Comfortaa } from 'next/font/google'
import React, { Suspense } from 'react'
import { PHProvider, PostHogPageview } from './providers'
import { cookies } from 'next/headers'
import { DARK_MODE } from '@/constants/ui'
import { Chivo_Mono } from 'next/font/google'
import { PageHeader } from '@/components/page-header'
import { PageFooter } from '@/components/page-footer'
import { LeaderboardContainer } from '@/components/leaderboard/leaderboard-container'
import { AuthContainer } from '@/components/auth/auth-container'
import { UserContainer } from '@/components/user/user-container'
import { Toaster } from '@/components/ui/toaster'
import { LoaderIcon } from 'lucide-react'
import { getOrCreateUser } from '@/actions/user'
import { getSession } from '@/actions/session'
import { TabRefocusDataRefresher } from '@/components/client-refocus-refresher'
import { NavigationEvents } from '@/components/navigation-events'
import { CookieConsent } from '@/components/cookie-consent'

const chivo = Chivo_Mono({
  weight: ['200', '400', '700'],
  subsets: ['latin'],
  preload: true,
})

const comfortaa = Comfortaa({ subsets: ['latin'], weight: '400', preload: true })

export const metadata: Metadata = {
  title: 'Fast⎵Flicks',
  openGraph: {
    type: 'website',
    title: 'Fast⎵Flicks',
    description: 'Practice and improve your 10 fingers typing speed!',
    url: 'https://fast-flicks.com',
  },
  manifest: '/manifest.json',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#111' },
    { media: '(prefers-color-scheme: light)', color: '#F5F5F5' },
  ],
  description:
    'Enhance your 10-finger typing speed across multiple languages with our minimalistic typing test app. Compete on the leaderboard and boost your typing skills.',
  icons: {
    icon: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '48x48',
        url: 'https://public-fast-flicks.s3.eu-central-1.amazonaws.com/icon_48.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '96x96',
        url: 'https://public-fast-flicks.s3.eu-central-1.amazonaws.com/icon_96.png',
      },
      {
        rel: 'icon',
        sizes: '144x144',
        url: 'https://public-fast-flicks.s3.eu-central-1.amazonaws.com/icon_144.png',
      },
      {
        rel: 'icon',
        sizes: '192x192',
        url: 'https://public-fast-flicks.s3.eu-central-1.amazonaws.com/icon_192.png',
      },
    ],
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies()
  const theme = cookieStore.get('theme')
  const session = await getSession()
  let user = undefined

  if (session && session?.user?.id) {
    user = await getOrCreateUser(session.user.id)
  }

  const isAuth = Boolean(session && session?.user?.id)

  return (
    <html lang="en" className={`${theme?.value ?? DARK_MODE} bg-moon-background`}>
      <Suspense>
        <PostHogPageview />
      </Suspense>

      <PHProvider>
        <body
          className={`${chivo.className} box-border flex min-h-screen flex-col items-center justify-between bg-sun-background text-sun-accent dark:bg-moon-background dark:text-moon-accent`}
        >
          <PageHeader isAuth={isAuth} className={`${comfortaa.className}`} />
          <Suspense
            fallback={
              <div>
                <LoaderIcon className="animate-spin" width={28} height={28} />
              </div>
            }
          >
            <div>
              {children}
              <Toaster />
            </div>
          </Suspense>

          <PageFooter className={`${comfortaa.className}`} />
          <Suspense>
            <LeaderboardContainer user={user} />
            <NavigationEvents />
          </Suspense>
          <AuthContainer isAuth={isAuth} />
          <UserContainer user={user} />
          <TabRefocusDataRefresher />
          <CookieConsent />
        </body>
      </PHProvider>
    </html>
  )
}

export const revalidate = 3600
