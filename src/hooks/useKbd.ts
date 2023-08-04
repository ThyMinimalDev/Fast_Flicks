import { SPACE_SYMBOL } from '@/constants/kbd'
import { getAcc, getGrossWPM, getWords } from '@/lib/words'
import { InputType, LanguageSetting, WordsCountSettings } from '@/types/kbd'
import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { useEvent, useKey, useToggle } from 'react-use'
import { ulid } from 'ulidx'
import { ToastObject, useToast } from '@/components/ui/use-toast'
import { UserWithHighscores } from '@/types/user'
let capsLockToast: ToastObject | undefined = undefined

type useKbdProps = {
  isOpenLeaderboard: boolean
  isOpenUserModal: boolean
  isOpenQuickAccess: boolean
  onNewHighscore: (
    user: UserWithHighscores,
    wpm: number,
    acc: number,
    score: number,
    words: WordsCountSettings,
    language: LanguageSetting
  ) => Promise<void>
  language: LanguageSetting
  wordsSettings: number
  setWPM: (wpm: number) => void
  setACC: (acc: number) => void
  user?: UserWithHighscores
}

export const useKbd = ({
  isOpenLeaderboard,
  isOpenUserModal,
  isOpenQuickAccess,
  onNewHighscore,
  language,
  setACC,
  setWPM,
  wordsSettings,
  user,
}: useKbdProps) => {
  const { toast } = useToast()
  const [, startTransition] = useTransition()
  const [currentLetter, setCurrentLetter] = useState<number>(0)
  const [words, setWords] = useState<string[]>([])
  const [errorMap, setErrorMap] = useState<{ [key: number]: boolean }>({})
  const [totalEntries, setTotalEntries] = useState<number>(0)
  const [totalErrors, setTotalErrors] = useState<number>(0)
  const [inputs, setInputs] = useState<InputType[]>([])
  const startTimeStampRef = useRef(0)
  const endTimeStampRef = useRef(0)
  const wordsString = useMemo(() => words.join(''), [words])
  const isModalOpen = useMemo(
    () => isOpenLeaderboard || isOpenUserModal || isOpenQuickAccess,
    [isOpenLeaderboard, isOpenQuickAccess, isOpenUserModal]
  )

  const [capsLocked, toggleCapsLock] = useToggle(false)
  const resetState = () => {
    setInputs([])
    setTotalEntries(0)
    setCurrentLetter(0)
    setErrorMap({})
    setTotalErrors(0)
  }

  const handleReset = useCallback(() => {
    if (!isModalOpen) {
      resetState()
      setWPM(0)
      setACC(0)
      const currentWords = getWords(wordsSettings, language)
      setWords(currentWords)
    }
  }, [setACC, setWPM, wordsSettings, isModalOpen, language])

  const handleNext = useCallback(() => {
    resetState()
    const currentWords = getWords(wordsSettings, language)
    setWords(currentWords)
  }, [wordsSettings, language])

  useKey('Escape', handleReset, undefined, [wordsSettings, language, isModalOpen])

  const onKeyDown = useCallback(
    ({ key, isTrusted }: { key: string; isTrusted: boolean }) => {
      if (!isModalOpen && isTrusted && key?.length === 1) {
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
    [wordsString, isModalOpen]
  )

  useEvent('keydown', onKeyDown)
  useEvent('keyup', event => {
    if (!capsLocked && event.getModifierState('CapsLock')) {
      toggleCapsLock(true)
      capsLockToast = toast({
        title: 'Caps Lock On!',
        description: 'it may stop you from doing the test',
      })
    }
    if (capsLocked && !event.getModifierState('CapsLock')) {
      if (capsLocked && capsLockToast) toggleCapsLock(false)
      capsLockToast?.dismiss()
      capsLockToast = undefined
    }
  })

  // Reset and generate new words when settings change
  useEffect(() => {
    handleReset()
    const currentWords = getWords(wordsSettings, language)
    setWords(currentWords)
  }, [wordsSettings, language, handleReset])

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
      const userHighscore = user?.highscores.find(
        score => score.words === wordsSettings && score.language === language
      )
      const currentScore = userHighscore?.score ?? 0
      if (user?.username && score > currentScore) {
        startTransition(() =>
          onNewHighscore(user, WPM, ACC, score, wordsSettings, language).then(() => {
            toast({
              title: 'New Highscore! 🎉',
              description: 'Your rank has been updated in the leaderboard',
            })
          })
        )
      }
      handleNext()
    }
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
    language,
    onNewHighscore,
    toast,
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
