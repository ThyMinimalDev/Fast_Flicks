import React, { FC } from 'react'
import { LeaderboardModal } from './leaderboard-modal'
import { prisma } from '@/lib/prisma'
import { ScoresByLeaderboardWithUser } from '@/types/leaderboard'
import { WORDS_SETTINGS } from '@/constants/kbd'
import { UserWithHighscores } from '@/types/user'
import { LeaderboardByWords } from '@prisma/client'
import { LeaderboardTabs } from './leaderboard-tabs'
import { LANGUAGES } from '@/constants/ui'
import { LeaderboardMessage } from './leaderboard-message'

type LeaderboardProps = {
  user?: UserWithHighscores
}

export const LeaderboardContainer: FC<LeaderboardProps> = async ({ user }) => {
  const dataByWords = await prisma.top5ByWords.findMany({
    include: { user: true },
    take: LANGUAGES.length * WORDS_SETTINGS.length * 5, // top 5 for each language and each test
    orderBy: { score: 'desc' },
  })
  const scores = dataByWords.reduce((acc, current) => {
    return {
      ...acc,
      [current.words]: [...(acc[current.words] ?? []), current],
    }
  }, {} as ScoresByLeaderboardWithUser)
  const userHighscores: LeaderboardByWords[] = user?.highscores ?? []

  return (
    <LeaderboardModal>
      <LeaderboardTabs
        scoresByLeaderboard={scores}
        userHighscores={userHighscores}
        username={user?.username}
      />
      <LeaderboardMessage isAuth={Boolean(user?.username)} />
    </LeaderboardModal>
  )
}
