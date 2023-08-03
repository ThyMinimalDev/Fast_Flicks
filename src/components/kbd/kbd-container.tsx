'use client'
import React, { FC } from 'react'
import { MemoizedKBDSettings as Settings } from './kbd-settings'
import { KBDBox as Box } from './kbd-box'
import { KBDInputs as Inputs } from './kbd-inputs'
import { useBoundStore } from '@/state/useBoundStore'
import useStore from '@/hooks/useStore'
import { useKbd } from '@/hooks/useKbd'
import { MemoizedKBDStats as Stats } from './kbd-stats'
import { MemoizedKBDInfoBubble as KBDInfoBubble } from './kbd-info-bubble'
import { TooltipProvider } from '@/components/ui/tooltip'
import { upsertHighscore } from '@/actions/leaderboard'

type KBDProps = {}

export const KBD: FC<KBDProps> = () => {
  const isOpenLeaderboard =
    useStore(useBoundStore, state => state.isOpenLeaderboard) ?? false
  const user = useStore(useBoundStore, state => state.user)
  const isFirstVisit = useStore(useBoundStore, state => state.isFirstVisit)
  const wordsSettings = useStore(useBoundStore, state => state.wordsSetting)
  const setWordsCount = useBoundStore(state => state.setWordsCount)
  const setIsFirstVisit = useBoundStore(state => state.setIsFirstVisit)
  const ACC = useStore(useBoundStore, state => state.ACC) ?? 0
  const WPM = useStore(useBoundStore, state => state.WPM) ?? 0
  const { inputs, words, currentLetter, errorMap, wordsString } = useKbd({
    onNewHighscore: upsertHighscore,
    isOpenLeaderboard,
    isOpenUserModal: Boolean(user && !user.username),
  })

  return (
    <div
      className={`flex w-[330px] flex-col gap-3  font-extralight sm:w-[530px] md:w-[730px] `}
    >
      <div className="flex w-full flex-row justify-between">
        <TooltipProvider delayDuration={300}>
          <Settings wordCount={wordsSettings ?? 50} onChangeWordCount={setWordsCount} />
          <Stats WPM={WPM ?? 0} ACC={ACC ?? 0} />
        </TooltipProvider>
      </div>
      <Box words={words} currentLetter={currentLetter} errorMap={errorMap} />
      <div className="flex flex-row justify-between">
        <Inputs inputs={inputs} firstLetter={wordsString?.charAt(0)} />
        {isFirstVisit !== undefined && (
          <KBDInfoBubble isFirstVisit={isFirstVisit} handleChange={setIsFirstVisit} />
        )}
      </div>
    </div>
  )
}
