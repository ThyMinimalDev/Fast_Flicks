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
import { useBoundStore } from '@/state/useBoundStore'
import { UiMode } from '@/types/ui'

type QuickAccessProps = {
  theme: UiMode
  toggleTheme: () => void
  isLeaderboardOpen: boolean
  toggleLeaderboard: () => void
}
export const QuickAccess: FC<QuickAccessProps> = ({
  theme,
  toggleTheme,
  isLeaderboardOpen,
  toggleLeaderboard,
}) => {
  const isOpen = useBoundStore(state => state.isOpenQuickAccess)
  const toggleModal = useBoundStore(state => state.setIsOpenQuickAccess)
  const language = useBoundStore(state => state.language)
  const setLang = useBoundStore(state => state.setLang)
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
          onBlur={() => toggleModal(false)}
          placeholder="Pick language and send commands..."
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Language">
            {LANGUAGES.filter(lang => lang !== language).map(lang => (
              <CommandItem
                onSelect={() => {
                  onCommandSelect(() => {
                    setLang(lang)
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
                  toggleLeaderboard()
                })
              }}
            >
              {isLeaderboardOpen ? 'Close' : 'Open'} Leaderboard
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
