import React, { FC } from 'react'
import { LeaderboardModal } from './leaderboard-modal'
import { prisma } from '@/lib/prisma'
import { ScoresByLeaderboardWithUser } from '@/types/leaderboard'
import { WORDS_SETTINGS } from '@/constants/kbd'

type LeaderboardProps = {}

export const LeaderboardContainer: FC<LeaderboardProps> = async () => {
  const dataByWords = await prisma.top5ByWords.findMany({
    include: { user: true },
    take: WORDS_SETTINGS.length * 5, // top 5 for each test
    orderBy: { score: 'desc' },
  })
  const scores = dataByWords.reduce((acc, current) => {
    return {
      ...acc,
      [current.words]: [...(acc[current.words] ?? []), current],
    }
  }, {} as ScoresByLeaderboardWithUser)

  return <LeaderboardModal scoresByLeaderboard={scores} />
}
