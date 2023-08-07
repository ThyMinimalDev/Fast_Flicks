import { create } from 'zustand'
import { UiSlice, createUiSlice } from './ui-slice'
import { persist } from 'zustand/middleware'
import { KbdSlice, createKbdSlice } from './kbd-slice'
import { UserSlice, createUserSlice } from './user-slice'

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
        return {
          ...currentState,
          ...(persistedState as UiSlice & KbdSlice),
          isOpenLoginModal: false,
          isOpenLeaderboard: false,
          isOpenQuickAccess: false,
          user: undefined,
        }
      },
    }
  )
)
