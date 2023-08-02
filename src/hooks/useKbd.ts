import { DEFAULT_WORDS_SETTING, SPACE_SYMBOL } from '@/constants/kbd'
import { getAcc, getGrossWPM, getWords } from '@/lib/words'
import { useBoundStore } from '@/state/useBoundStore'
import { InputType, WordsCountSettings } from '@/types/kbd'
import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { useEvent, useKey } from 'react-use'
import { ulid } from 'ulidx'
import { useStore } from 'zustand'
import { useToast } from '@/components/ui/use-toast'
import { UserWithHighscores } from '@/types/user'

type useKbdProps = {
  isOpenLeaderboard: boolean
  isOpenUserModal: boolean
  onNewHighscore: (
    user: UserWithHighscores,
    wpm: number,
    acc: number,
    score: number,
    words: WordsCountSettings
  ) => Promise<void>
}

export const useKbd = ({
  isOpenLeaderboard,
  isOpenUserModal,
  onNewHighscore,
}: useKbdProps) => {
  const { toast } = useToast()
  const [, startTransition] = useTransition()
  const user = useStore(useBoundStore, state => state.user)
  const [currentLetter, setCurrentLetter] = useState<number>(0)
  const [words, setWords] = useState<string[]>([])
  const [errorMap, setErrorMap] = useState<{ [key: number]: boolean }>({})
  const [totalEntries, setTotalEntries] = useState<number>(0)
  const [totalErrors, setTotalErrors] = useState<number>(0)
  const [inputs, setInputs] = useState<InputType[]>([])
  const startTimeStampRef = useRef(0)
  const endTimeStampRef = useRef(0)
  const wordsSettings =
    useStore(useBoundStore, state => state.wordsSetting) ?? DEFAULT_WORDS_SETTING
  const setWPM = useStore(useBoundStore, state => state.setWPM)
  const setACC = useStore(useBoundStore, state => state.setACC)
  const wordsString = useMemo(() => words.join(''), [words])

  const resetState = () => {
    setInputs([])
    setTotalEntries(0)
    setCurrentLetter(0)
    setErrorMap({})
    setTotalErrors(0)
  }

  const handleReset = useCallback(() => {
    resetState()
    setWPM(0)
    setACC(0)
    const currentWords = getWords(wordsSettings)
    setWords(currentWords)
  }, [setACC, setWPM, wordsSettings])

  const handleNext = useCallback(() => {
    resetState()
    const currentWords = getWords(wordsSettings)
    setWords(currentWords)
  }, [wordsSettings])

  useKey('Escape', handleReset, undefined, [wordsSettings])

  const onKeyDown = useCallback(
    ({ key, isTrusted }: { key: string; isTrusted: boolean }) => {
      if (!isOpenLeaderboard && !isOpenUserModal && isTrusted && key?.length === 1) {
        setTotalEntries(totalEntries => {
          if (totalEntries === 0) {
            startTimeStampRef.current = Date.now()
          }
          return totalEntries + 1
        })

        setCurrentLetter(state => {
          const char = wordsString.charAt(state)
          const isError = key === ' ' ? char !== SPACE_SYMBOL : char !== key

          setInputs(inputs => {
            if (inputs.length === 15) {
              inputs.shift()
            }
            inputs.push({
              id: ulid(),
              value: key === ' ' ? SPACE_SYMBOL : key,
              isError,
            })
            return [...inputs]
          })

          setErrorMap(errorMapState => ({
            ...errorMapState,
            [state]: errorMapState[state] ?? isError,
          }))

          if (isError) {
            setTotalErrors(state => state + 1)
            return state
          }

          return state + 1
        })
      }
    },
    [wordsString, isOpenLeaderboard, isOpenUserModal]
  )

  useEvent('keydown', onKeyDown)

  // Reset and generate new words when settings change
  useEffect(() => {
    handleReset()
    const currentWords = getWords(wordsSettings)
    setWords(currentWords)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordsSettings])

  // When user reaches end of current test text:
  // Compute stats & start next text test
  useEffect(() => {
    if (wordsString.length > 0 && currentLetter === wordsString.length) {
      endTimeStampRef.current = Date.now()
      const timeToComplete = dayjs(endTimeStampRef.current).diff(
        dayjs(startTimeStampRef.current),
        'minute',
        true
      )
      const WPM = Math.round(getGrossWPM(totalEntries, timeToComplete)) ?? 0
      const ACC = Math.round(getAcc(totalEntries, totalErrors)) ?? 0
      const score = (WPM * 0.7 + ACC * 1.3) * (wordsSettings / 2)
      setWPM(WPM)
      setACC(ACC)
      const userHighscore = user?.highscores.find(score => score.words === wordsSettings)
      const currentScore = userHighscore?.score ?? 0
      if (user?.username && score > currentScore) {
        startTransition(() =>
          onNewHighscore(user, WPM, ACC, score, wordsSettings).then(() => {
            toast({
              title: 'New Highscore! 🎉',
              description: 'Your rank has been updated in the leaderboard',
            })
          })
        )
      }
      handleNext()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentLetter,
    handleNext,
    setACC,
    setWPM,
    totalEntries,
    totalErrors,
    wordsString,
    wordsSettings,
    user,
  ])

  return {
    inputs,
    totalEntries,
    words,
    currentLetter,
    wordsString,
    errorMap,
  }
}
