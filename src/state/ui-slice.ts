import { StateCreator } from 'zustand'

export interface UiSlice {
  isOpenLeaderboard: boolean
  isOpenLoginModal: boolean
  setIsOpenLoginModal: () => void
  isOpenQuickAccess: boolean
  setIsOpenQuickAccess: (value?: boolean) => void
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
  isOpenQuickAccess: false,
  setIsOpenQuickAccess: value =>
    set(state => ({ isOpenQuickAccess: value ?? !state.isOpenQuickAccess })),
  toggleLeaderboard: () =>
    set(state => ({
      isOpenLeaderboard: !state.isOpenLeaderboard,
    })),
})
