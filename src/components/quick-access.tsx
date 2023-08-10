import React, { FC, useEffect } from 'react'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from './ui/command'
import useKeyboardJs from 'react-use/lib/useKeyboardJs'
import { DARK_MODE, LANGUAGES, LIGHT_MODE } from '@/constants/ui'
import { useBoundStore } from '@/state/use-bound-store'
import { UiMode } from '@/types/ui'
import { PICK_LANG } from '@/state/kbd-slice'

type QuickAccessProps = {
  theme: UiMode
  toggleTheme: () => void
  isLeaderboardOpen: boolean
  leaderboardCmd: () => void
  signInCmd: () => void
  signOutCmd: () => void
  isAuth: boolean
}
export const QuickAccess: FC<QuickAccessProps> = ({
  theme,
  toggleTheme,
  isLeaderboardOpen,
  leaderboardCmd,
  signInCmd,
  signOutCmd,
  isAuth,
}) => {
  const isOpen = useBoundStore(state => state.isOpenQuickAccess)
  const toggleModal = useBoundStore(state => state.setIsOpenQuickAccess)
  const language = useBoundStore(state => state.language)
  const dispatch = useBoundStore(state => state.dispatch)

  const [isPressed] = useKeyboardJs('alt + k')
  useEffect(() => {
    if (isPressed) {
      toggleModal(true)
    }
  }, [isPressed, toggleModal])
  const onCommandSelect = (func: () => void) => {
    func()
    toggleModal(false)
  }
  return (
    <CommandDialog open={isOpen}>
      <Command
        className="relative"
        onKeyDown={e => {
          if (e.key === 'Escape') {
            toggleModal(false)
          }
        }}
      >
        <CommandInput
          onBlur={() => toggleModal(true)}
          placeholder="Pick language and send commands..."
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Language">
            {LANGUAGES.filter(lang => lang !== language).map(lang => (
              <CommandItem
                onSelect={() => {
                  onCommandSelect(() => {
                    dispatch({ type: PICK_LANG, language: lang })
                  })
                }}
                key={`${lang}-cmd-item`}
              >
                {lang}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Commands">
            <CommandItem
              onSelect={() => {
                onCommandSelect(() => {
                  toggleTheme()
                })
              }}
            >
              <div>
                <span className="capitalize">
                  {theme === 'dark' ? LIGHT_MODE : DARK_MODE}
                </span>{' '}
                Mode
              </div>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                onCommandSelect(() => {
                  leaderboardCmd()
                })
              }}
            >
              {isLeaderboardOpen ? 'Close' : 'Open'} Leaderboard
            </CommandItem>
            <CommandItem
              onSelect={() => {
                onCommandSelect(() => {
                  isAuth ? signOutCmd() : signInCmd()
                })
              }}
            >
              {isAuth ? 'Sign Out' : 'Sign In'}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
