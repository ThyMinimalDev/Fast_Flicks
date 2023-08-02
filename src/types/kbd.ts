import { WORDS_SETTINGS } from '@/constants/kbd'

export type WordsCountSettings = (typeof WORDS_SETTINGS)[number]

export type InputType = {
  id: string
  value: string
  isError: boolean
}
