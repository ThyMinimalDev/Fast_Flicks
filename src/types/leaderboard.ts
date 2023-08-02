import { Leaderboard as LeaderboardType, User } from '@prisma/client'
import { WordsCountSettings } from './kbd'

export type ScoresByLeaderboardRaw = {
  words: number
  scores: LeaderboardType
}

export type ScoresByLeaderboard = { [key: WordsCountSettings]: LeaderboardType[] }
export type ScoresByLeaderboardWithUser = {
  [key: WordsCountSettings]: (LeaderboardType & { user: User })[]
}
export type LeaderboardWithUser = LeaderboardType & { user: User }
