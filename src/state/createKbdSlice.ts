import { StateCreator } from 'zustand'
import { UiSlice } from './createUiSlice'
import { WordsCountSettings } from '@/types/kbd'

export interface KbdSlice {
  wordsSetting: WordsCountSettings
  setWordsCount: (words: WordsCountSettings) => void
  setACC: (ACC: number) => void
  setWPM: (WPM: number) => void
  WPM: number
  ACC: number
}

export const createKbdSlice: StateCreator<UiSlice & KbdSlice, [], [], KbdSlice> = (
  set,
  get
) => ({
  wordsSetting: 25,
  ACC: 0,
  WPM: 0,
  setWPM: (WPM: number) => set(() => ({ WPM })),
  setACC: (ACC: number) => set(() => ({ ACC })),
  setWordsCount: (words: WordsCountSettings) =>
    set(() => {
      return { wordsSetting: words }
    }),
})
