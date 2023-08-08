import { SPACE_SYMBOL } from '@/constants/kbd'
import { getAcc, getGrossWPM, getWords } from '@/lib/words'
import { InputType, LanguageSetting, WordsCountSettings } from '@/types/kbd'
import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useEvent, useKey, usePrevious } from 'react-use'
import { ulid } from 'ulidx'
import { useToast } from '@/components/ui/use-toast'

type useKbdProps = {
  disabled: boolean
  onComplete: (wpm: number, acc: number, score: number) => void
  onReset: () => void
  language: LanguageSetting
  wordsSettings: WordsCountSettings
}

type KbdStateType = {
  currentLetter: number
  totalEntries: number
  errorMap: { [key: number]: boolean }
  totalErrors: number
  inputs: InputType[]
}

const KBD_INIT_STATE = {
  currentLetter: 0,
  totalEntries: 0,
  totalErrors: 0,
  errorMap: {},
  inputs: [],
}

export const useKbd = ({
  disabled,
  onComplete,
  language,
  onReset,
  wordsSettings,
}: useKbdProps) => {
  const { toast } = useToast()

  const [words, setWords] = useState<string[]>([])
  const [{ currentLetter, totalEntries, totalErrors, errorMap, inputs }, setKbd] =
    useState<KbdStateType>(KBD_INIT_STATE)
  const startTimeStampRef = useRef(0)
  const endTimeStampRef = useRef(0)
  const wordsString = useMemo(() => words.join(''), [words])

  const handleReset = useCallback(() => {
    if (!disabled) {
      setKbd(_ => KBD_INIT_STATE)
      onReset()
      const currentWords = getWords(wordsSettings, language)
      setWords(currentWords)
    }
  }, [onReset, wordsSettings, disabled, language])

  const handleNext = useCallback(() => {
    setKbd(_ => KBD_INIT_STATE)
    const currentWords = getWords(wordsSettings, language)
    setWords(currentWords)
  }, [wordsSettings, language])

  useKey('Escape', handleReset, undefined, [wordsSettings, language, disabled])

  const onKeyDown = useCallback(
    ({ key, isTrusted }: { key: string; isTrusted: boolean }) => {
      if (!disabled && isTrusted && key?.length === 1) {
        setKbd(({ totalEntries, totalErrors, inputs, errorMap, currentLetter }) => {
          const char = wordsString.charAt(currentLetter)
          const isError = key === ' ' ? char !== SPACE_SYMBOL : char !== key
          const inputsCopy = [...inputs]

          if (totalEntries === 0) {
            startTimeStampRef.current = Date.now()
          }

          if (inputsCopy.length === 15) {
            inputsCopy.shift()
          }

          inputsCopy.push({
            id: ulid(),
            value: key === ' ' ? SPACE_SYMBOL : key,
            isError,
          })

          return {
            totalEntries: totalEntries + 1,
            totalErrors: isError ? totalErrors + 1 : totalErrors,
            errorMap: {
              ...errorMap,
              [currentLetter]: errorMap[currentLetter] ?? isError,
            },
            currentLetter: isError ? currentLetter : currentLetter + 1,
            inputs: inputsCopy,
          }
        })
      }
    },
    [wordsString, disabled]
  )

  useEvent('keydown', onKeyDown)

  // Reset and generate new words when settings change
  const previousWordsSettings = usePrevious(wordsSettings)
  const previousLanguage = usePrevious(language)
  useEffect(() => {
    if (previousWordsSettings !== wordsSettings || previousLanguage !== language) {
      handleReset()
      const currentWords = getWords(wordsSettings, language)
      setWords(currentWords)
    }
  }, [wordsSettings, language, handleReset, previousWordsSettings, previousLanguage])

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
      onComplete(WPM, ACC, score)
      handleNext()
    }
  }, [
    currentLetter,
    handleNext,
    totalEntries,
    totalErrors,
    wordsString,
    wordsSettings,
    toast,
    onComplete,
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
