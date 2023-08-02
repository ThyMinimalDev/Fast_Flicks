import { create } from 'zustand'
import { UiSlice, createUiSlice } from './createUiSlice'
import { persist } from 'zustand/middleware'
import { KbdSlice, createKbdSlice } from './createKbdSlice'
import { UserSlice, createUserSlice } from './createUserSlice'

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
          user: undefined,
        }
      },
    }
  )
)
