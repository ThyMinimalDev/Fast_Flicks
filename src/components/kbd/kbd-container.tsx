'use client'
import React, { FC, useCallback } from 'react'
import { MemoizedKBDSettings as Settings } from './kbd-settings'
import { KBDBox as Box } from './kbd-box'
import { KBDInputs as Inputs } from './kbd-inputs'
import { useBoundStore } from '@/state/use-bound-store'
import useStore from '@/hooks/use-store'
import { useKbd } from '@/hooks/use-kbd'
import { MemoizedKBDStats as Stats } from './kbd-stats'
import { MemoizedKBDInfoBubble as KBDInfoBubble } from './kbd-info-bubble'
import { TooltipProvider } from '@/components/ui/tooltip'
import { DEFAULT_WORDS_SETTING } from '@/constants/kbd'
import { useCapslock } from '@/hooks/use-capslock'
import { INPUT, PICK_WORDS, RESET } from '@/state/kbd-slice'
import { useToast } from '@/components/ui/use-toast'

type KBDProps = {}

export const KBD: FC<KBDProps> = () => {
  const ACC = useStore(useBoundStore, state => state.ACC) ?? 0
  const WPM = useStore(useBoundStore, state => state.WPM) ?? 0
  const currentLetter = useStore(useBoundStore, state => state.currentLetter) ?? 0
  const words = useStore(useBoundStore, state => state.words) ?? []
  const inputs = useStore(useBoundStore, state => state.inputs) ?? []
  const wordsString = useStore(useBoundStore, state => state.wordsString) ?? ''
  const errorMap = useStore(useBoundStore, state => state.errorMap) ?? {}
  const wordsSettings =
    useStore(useBoundStore, state => state.wordsSetting) ?? DEFAULT_WORDS_SETTING
  const isFirstVisit = useStore(useBoundStore, state => state.isFirstVisit)
  const setIsFirstVisit = useBoundStore(state => state.setIsFirstVisit)
  const dispatch = useBoundStore(state => state.dispatch)
  const { toast } = useToast()

  const onInput = useCallback(
    (key: string) =>
      dispatch({
        type: INPUT,
        key,
        onSuccess: () => {
          toast({
            title: 'New Highscore! 🎉',
            description: 'Your rank has been updated in the leaderboard',
          })
        },
      }),
    [dispatch, toast]
  )
  const onEsc = useCallback(() => dispatch({ type: RESET }), [dispatch])
  useKbd({ onEsc, onInput })
  useCapslock()

  return (
    <div
      className={`flex w-[330px] flex-col gap-3  font-extralight sm:w-[530px] md:w-[730px] `}
    >
      <div className="flex w-full flex-row justify-between">
        <TooltipProvider delayDuration={300}>
          <Settings
            wordCount={wordsSettings}
            onChangeWordCount={wordsSetting => {
              dispatch({ type: PICK_WORDS, wordsSetting })
            }}
          />
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
