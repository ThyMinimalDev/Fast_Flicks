import { StateCreator } from 'zustand'
import { UiSlice } from './ui-slice'
import { KbdStateType, LanguageSetting, WordsCountSettings } from '@/types/kbd'
import { EN_LANGUAGE } from '@/constants/ui'
import { computeStats, generateWordsData } from '@/lib/words'
import { DEFAULT_WORDS_SETTING, SPACE_SYMBOL } from '@/constants/kbd'
import { ulid } from 'ulidx'
import { UserSlice } from './user-slice'
import { upsertHighscore } from '@/actions/leaderboard'

// Actions
export const START = 'START'
export const NEXT = 'NEXT'
export const RESET = 'RESET'
export const PICK_LANG = 'LANGUAGE'
export const PICK_WORDS = 'WORDS'
export const INPUT = 'INPUT'

// Init States
const KBD_INIT_STATE = {
  currentLetter: 0,
  totalEntries: 0,
  totalErrors: 0,
  errorMap: {},
  inputs: [],
}

const PARTIAL_RESET_STATE = {
  ...KBD_INIT_STATE,
  startTime: 0,
  endTime: 0,
}

export const FULL_RESET_STATE = {
  ...PARTIAL_RESET_STATE,
  ACC: 0,
  WPM: 0,
}

// Discriminative Union on action Type
type reducerArgs =
  | ({ type: typeof PICK_LANG } & Pick<KbdSlice, 'language'>)
  | ({ type: typeof PICK_WORDS } & Pick<KbdSlice, 'wordsSetting'>)
  | { type: typeof RESET }
  | { type: typeof INPUT; key: string; onSuccess: () => void }

// Reducers
const handleTestCompleted = (state: KbdSlice & UserSlice, onSuccess: () => void) => {
  const { score, WPM, ACC } = computeStats(state)
  const currentHighscore =
    state.user?.highscores.find(
      score => score.words === state.wordsSetting && score.language === state.language
    )?.score ?? 0

  if (state.user?.username && score > currentHighscore) {
    upsertHighscore(
      {
        wpm: WPM,
        acc: ACC,
        score,
        words: state.wordsSetting,
        language: state.language,
      },
      state.user
    )
      .then(() => {
        onSuccess()
      })
      .catch(console.error)
  }
  return {
    ...state,
    score,
    WPM,
    ACC,
    ...PARTIAL_RESET_STATE,
    ...generateWordsData(state),
  }
}

const reducer = (
  state: KbdSlice & UiSlice & UserSlice,
  args: reducerArgs
): Partial<KbdSlice> => {
  switch (args.type) {
    case INPUT:
      // if a modal is open, ignore inputs
      const mustSetUsername = Boolean(state.user && !state.user.username)
      if (state.isOpenQuickAccess || state.isOpenLeaderboard || mustSetUsername) {
        return state
      }

      const { startTime, wordsString, currentLetter, inputs, user, ...rest } = state
      const { key } = args
      const char = wordsString.charAt(currentLetter)
      const isError = key === ' ' ? char !== SPACE_SYMBOL : char !== key
      const inputsCopy = [...inputs]
      const letterIndex = isError ? currentLetter : currentLetter + 1

      if (inputsCopy.length === 15) {
        inputsCopy.shift()
      }

      inputsCopy.push({
        id: ulid(),
        value: key === ' ' ? SPACE_SYMBOL : key,
        isError,
      })

      // test is done, compute stats and generate next test
      if (letterIndex === wordsString.length) {
        return handleTestCompleted(state, args.onSuccess)
      }

      return {
        ...state,
        startTime: rest.totalEntries === 0 ? Date.now() : startTime,
        totalEntries: rest.totalEntries + 1,
        totalErrors: isError ? rest.totalErrors + 1 : rest.totalErrors,
        errorMap: {
          ...rest.errorMap,
          [currentLetter]: rest.errorMap[currentLetter] ?? isError,
        },
        currentLetter: letterIndex,
        inputs: inputsCopy,
      }

    case PICK_LANG:
      return {
        ...state,
        ...args,
        ...FULL_RESET_STATE,
        ...generateWordsData({ ...state, language: args.language }),
      }

    case PICK_WORDS:
      return {
        ...state,
        ...args,
        ...FULL_RESET_STATE,
        ...generateWordsData({ ...state, wordsSetting: args.wordsSetting }),
      }

    case RESET:
      return {
        ...state,
        ...FULL_RESET_STATE,
        ...generateWordsData(state),
      }
  }
}

// Store
export interface KbdSlice extends KbdStateType {
  wordsSetting: WordsCountSettings
  words: string[]
  wordsString: string
  WPM: number
  ACC: number
  language: LanguageSetting
  dispatch: (args: reducerArgs) => void
  startTime: number
  endTime: number
  score: number
}

export const createKbdSlice: StateCreator<
  UiSlice & KbdSlice & UserSlice,
  [],
  [],
  KbdSlice
> = set => {
  return {
    wordsSetting: DEFAULT_WORDS_SETTING,
    words: [],
    score: 0,
    wordsString: '',
    ACC: 0,
    WPM: 0,
    startTime: 0,
    endTime: 0,
    language: EN_LANGUAGE,
    ...KBD_INIT_STATE,
    dispatch: args => set(state => reducer(state, args)),
  }
}
