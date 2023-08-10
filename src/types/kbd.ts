import {
  FR_LANGUAGE,
  ES_LANGUAGE,
  JP_LANGUAGE,
  CN_LANGUAGE,
  RU_LANGUAGE,
  KR_LANGUAGE,
  EN_LANGUAGE,
} from './../constants/ui'
import { WORDS_SETTINGS } from '@/constants/kbd'

export type WordsCountSettings = (typeof WORDS_SETTINGS)[number]

export type InputType = {
  id: string
  value: string
  isError: boolean
}

export type LanguageSetting =
  | typeof FR_LANGUAGE
  | typeof ES_LANGUAGE
  | typeof JP_LANGUAGE
  | typeof CN_LANGUAGE
  | typeof RU_LANGUAGE
  | typeof KR_LANGUAGE
  | typeof EN_LANGUAGE

export type KbdStateType = {
  currentLetter: number
  totalEntries: number
  errorMap: { [key: number]: boolean }
  totalErrors: number
  inputs: InputType[]
}
export type ComputeStatsProps = {
  totalEntries: number
  totalErrors: number
  startTime: number
  wordsSetting: number
}
export type Stats = { WPM: number; ACC: number; score: number }

export type GenerateWordsDataProps = { language?: LanguageSetting; wordsSetting?: number }
export type WordsData = { words: string[]; wordsString: string }
