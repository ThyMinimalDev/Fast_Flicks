import { create } from 'zustand'
import { UiSlice, createUiSlice } from './ui-slice'
import { persist } from 'zustand/middleware'
import {
  FULL_RESET_STATE as RESET_KBD_STATE,
  KbdSlice,
  createKbdSlice,
} from './kbd-slice'
import { UserSlice, createUserSlice } from './user-slice'
import { generateWordsData } from '@/lib/words'

export const useBoundStore = create<UiSlice & KbdSlice & UserSlice>()(
  persist(
    (...a) => ({
      ...createKbdSlice(...a),
      ...createUiSlice(...a),
      ...createUserSlice(...a),
    }),
    {
      name: 'kbd-storage', // name of the item in the storage (must be unique)
      merge: (persistedState, currentState) => {
        const savedState = persistedState as Partial<UiSlice & KbdSlice & UserSlice>
        return {
          ...currentState,
          ...savedState,
          isOpenLoginModal: false,
          isOpenLeaderboard: false,
          isOpenQuickAccess: false,
          user: undefined,
          ...RESET_KBD_STATE,
          ...generateWordsData(savedState),
          score: 0,
        }
      },
    }
  )
)
