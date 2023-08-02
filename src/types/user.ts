import { LeaderboardByWords, User } from '@prisma/client'

export type UserWithHighscores = User & { highscores: LeaderboardByWords[] }
