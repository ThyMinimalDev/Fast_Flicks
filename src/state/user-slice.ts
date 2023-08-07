import { UserWithHighscores } from '@/types/user'
import { StateCreator } from 'zustand'

export interface UserSlice {
  user?: UserWithHighscores
  setUser: (user: UserWithHighscores) => void
}
export const createUserSlice: StateCreator<UserSlice, [], [], UserSlice> = set => ({
  user: undefined,
  setUser: user => set(_ => ({ user })),
})
