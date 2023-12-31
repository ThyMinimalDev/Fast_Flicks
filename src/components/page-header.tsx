'use client'
import {
  CommandIcon,
  LogInIcon,
  LogOutIcon,
  MoonIcon,
  SunIcon,
  TrophyIcon,
} from 'lucide-react'
import React, { FC, useState } from 'react'
import { Separator } from './ui/separator'
import { SPACE_SYMBOL } from '@/constants/kbd'
import { DARK_MODE, LIGHT_MODE } from '@/constants/ui'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useBoundStore } from '@/state/use-bound-store'
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { supbaseClientComponentClient } from '@/lib/supabase'
import { useToast } from './ui/use-toast'
import Link from 'next/link'

import { QuickAccess } from './quick-access'
import { UiMode } from '@/types/ui'

type HeaderProps = { isAuth: boolean; className?: string }

export const PageHeader: FC<HeaderProps> = ({ isAuth, className }) => {
  const router = useRouter()
  const { toast } = useToast()
  const toggleLeaderboard = useBoundStore(state => state.toggleLeaderboard)
  const toggleLoginModal = useBoundStore(state => state.setIsOpenLoginModal)
  const isOpenLeaderboard = useBoundStore(state => state.isOpenLeaderboard)
  const [theme, setThemeState] = useState<UiMode>(DARK_MODE)
  const toggleQuickAccess = useBoundStore(state => state.setIsOpenQuickAccess)

  const setTheme = (mode: UiMode) => {
    document.cookie = `theme=${mode}; SameSite=None; Secure`
    const html = document.documentElement
    html.className = html.className.replace(mode === DARK_MODE ? 'light' : 'dark', mode)
    setThemeState(mode)
  }
  const setDarkTheme = () => setTheme(DARK_MODE)
  const setLightTheme = () => setTheme(LIGHT_MODE)

  const handleLogOut = async () => {
    await supbaseClientComponentClient.auth.signOut()
    toast({
      title: 'Until Next Time!',
      description: 'You Are Now Signed Out 👋',
    })
    router.refresh()
  }

  return (
    <div className={cn('mb-4 w-full px-2 sm:px-9', className)}>
      <div className="mt-6 flex flex-row justify-between">
        <Link href="/">
          <div className="flex select-none flex-row text-base">
            FAST
            <div className="mx-0.5 -translate-x-0.5 -translate-y-0.5">{SPACE_SYMBOL}</div>
            FLICKS
          </div>
        </Link>
        <QuickAccess
          theme={theme}
          toggleTheme={theme === DARK_MODE ? setLightTheme : setDarkTheme}
          leaderboardCmd={toggleLeaderboard}
          isLeaderboardOpen={isOpenLeaderboard}
          signInCmd={toggleLoginModal}
          signOutCmd={handleLogOut}
          isAuth={isAuth}
        />
        <div className="flex flex-row gap-4">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger>
                {isAuth ? (
                  <LogOutIcon className="cursor-pointer" onClick={handleLogOut} />
                ) : (
                  <LogInIcon className="cursor-pointer" onClick={toggleLoginModal} />
                )}
                <TooltipContent side="bottom" sideOffset={8}>
                  {isAuth ? 'Sign Out' : 'Sign In'}
                </TooltipContent>
              </TooltipTrigger>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <CommandIcon
                  className="cursor-pointer"
                  onClick={() => toggleQuickAccess(true)}
                />
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={8}>
                Quick Access
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <TrophyIcon className="cursor-pointer" onClick={toggleLeaderboard} />
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={8}>
                Leaderboard
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {theme === DARK_MODE ? (
            <SunIcon className="cursor-pointer" onClick={() => setTheme('light')} />
          ) : (
            <MoonIcon className="cursor-pointer" onClick={() => setTheme('dark')} />
          )}
        </div>
      </div>
      <Separator className="mt-6" />
    </div>
  )
}
