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
