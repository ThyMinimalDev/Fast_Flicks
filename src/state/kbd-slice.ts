import { StateCreator } from 'zustand'
import { UiSlice } from './ui-slice'
import { LanguageSetting, WordsCountSettings } from '@/types/kbd'
import { EN_LANGUAGE } from '@/constants/ui'

export interface KbdSlice {
  wordsSetting: WordsCountSettings
  setWordsCount: (words: WordsCountSettings) => void
  setACC: (ACC: number) => void
  setWPM: (WPM: number) => void
  WPM: number
  ACC: number
  language: LanguageSetting
  setLang: (language: LanguageSetting) => void
}

export const createKbdSlice: StateCreator<UiSlice & KbdSlice, [], [], KbdSlice> = (
  set,
  get
) => ({
  wordsSetting: 25,
  ACC: 0,
  WPM: 0,
  language: EN_LANGUAGE,
  setWPM: (WPM: number) => set(() => ({ WPM })),
  setACC: (ACC: number) => set(() => ({ ACC })),
  setLang: (language: LanguageSetting) => set(() => ({ language })),
  setWordsCount: (words: WordsCountSettings) =>
    set(() => {
      return { wordsSetting: words }
    }),
})
