import { StateCreator } from 'zustand'

export interface UiSlice {
  isOpenLeaderboard: boolean
  isOpenLoginModal: boolean
  setIsOpenLoginModal: () => void
  setIsFirstVisit: () => void
  toggleLeaderboard: () => void
  isFirstVisit: boolean
}
export const createUiSlice: StateCreator<UiSlice, [], [], UiSlice> = set => ({
  isOpenLeaderboard: false,
  isFirstVisit: true,
  setIsFirstVisit: () => set(() => ({ isFirstVisit: false })),
  isOpenLoginModal: false,
  setIsOpenLoginModal: () =>
    set(state => ({ isOpenLoginModal: !state.isOpenLoginModal })),
  toggleLeaderboard: () =>
    set(state => ({
      isOpenLeaderboard: !state.isOpenLeaderboard,
    })),
})
