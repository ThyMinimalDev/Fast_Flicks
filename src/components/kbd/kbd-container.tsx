'use client'
import React, { FC, useCallback, useMemo, useTransition } from 'react'
import { MemoizedKBDSettings as Settings } from './kbd-settings'
import { KBDBox as Box } from './kbd-box'
import { KBDInputs as Inputs } from './kbd-inputs'
import { useBoundStore } from '@/state/use-bound-store'
import useStore from '@/hooks/use-store'
import { useKbd } from '@/hooks/use-kbd'
import { MemoizedKBDStats as Stats } from './kbd-stats'
import { MemoizedKBDInfoBubble as KBDInfoBubble } from './kbd-info-bubble'
import { TooltipProvider } from '@/components/ui/tooltip'
import { upsertHighscore } from '@/actions/leaderboard'
import { EN_LANGUAGE } from '@/constants/ui'
import { DEFAULT_WORDS_SETTING } from '@/constants/kbd'
import { useToast } from '@/components/ui/use-toast'
import { useCapslock } from '@/hooks/use-capslock'

type KBDProps = {}

export const KBD: FC<KBDProps> = () => {
  const user = useStore(useBoundStore, state => state.user)
  const ACC = useStore(useBoundStore, state => state.ACC) ?? 0
  const WPM = useStore(useBoundStore, state => state.WPM) ?? 0
  const setWPM = useBoundStore(state => state.setWPM)
  const setACC = useBoundStore(state => state.setACC)
  const wordsSettings =
    useStore(useBoundStore, state => state.wordsSetting) ?? DEFAULT_WORDS_SETTING
  const language = useStore(useBoundStore, state => state.language) ?? EN_LANGUAGE
  const setWordsCount = useBoundStore(state => state.setWordsCount)
  const isOpenQuickAccess =
    useStore(useBoundStore, state => state.isOpenQuickAccess) ?? false
  const isOpenLeaderboard =
    useStore(useBoundStore, state => state.isOpenLeaderboard) ?? false
  const setIsFirstVisit = useBoundStore(state => state.setIsFirstVisit)
  const isFirstVisit = useStore(useBoundStore, state => state.isFirstVisit)
  const { toast } = useToast()
  const [, startTransition] = useTransition()
  const _ = useCapslock()

  const onComplete = useCallback(
    (wpm: number, acc: number, score: number) => {
      setWPM(wpm)
      setACC(acc)
      const currentHighscore =
        user?.highscores.find(
          score => score.words === wordsSettings && score.language === language
        )?.score ?? 0

      if (!user?.username || currentHighscore >= score) {
        return
      }

      startTransition(() =>
        upsertHighscore({ wpm, acc, score, words: wordsSettings, language }, user)
          .then(() => {
            toast({
              title: 'New Highscore! 🎉',
              description: 'Your rank has been updated in the leaderboard',
            })
          })
          .catch(console.error)
      )
    },
    [language, setACC, setWPM, toast, user, wordsSettings]
  )

  const onReset = useCallback(() => {
    setACC(0)
    setWPM(0)
  }, [setACC, setWPM])

  const isModalOpen = useMemo(
    () => isOpenQuickAccess || isOpenLeaderboard || Boolean(user && !user.username),
    [isOpenLeaderboard, isOpenQuickAccess, user]
  )

  const { inputs, words, currentLetter, errorMap, wordsString } = useKbd({
    onComplete,
    onReset,
    disabled: isModalOpen,
    language,
    wordsSettings,
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
