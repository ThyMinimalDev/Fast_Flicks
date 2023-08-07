'use client'
import React, { FC } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useStore from '@/hooks/use-store'
import { useBoundStore } from '@/state/use-bound-store'
import { WORDS_SETTINGS } from '@/constants/kbd'
import { ScoresByLeaderboardWithUser } from '@/types/leaderboard'
import { LeaderboardByWords } from '@prisma/client'
import { LeaderboardTable } from './leaderboard-table'

type TabsProps = {
  scoresByLeaderboard: ScoresByLeaderboardWithUser
  userHighscores: LeaderboardByWords[]
  username: string | null | undefined
}
export const LeaderboardTabs: FC<TabsProps> = ({
  scoresByLeaderboard,
  userHighscores,
  username,
}) => {
  const language = useStore(useBoundStore, state => state.language)
  const wordsSettings = useStore(useBoundStore, state => state.wordsSetting)
  return wordsSettings && language ? (
    <Tabs defaultValue={wordsSettings.toString()} className="pt-1 font-light">
      <TabsList className="grid w-full grid-cols-3">
        {WORDS_SETTINGS.map(words => (
          <TabsTrigger key={`trigger-words-${words}`} value={words.toString()}>
            {words}
          </TabsTrigger>
        ))}
      </TabsList>
      {WORDS_SETTINGS.map(words => (
        <TabsContent key={`content-words-${words}`} value={words.toString()}>
          <LeaderboardTable
            scores={scoresByLeaderboard[words].filter(data => data.language === language)}
            userHighscore={userHighscores.find(
              score => score.words === words && score.language === language
            )}
            username={username}
          />
        </TabsContent>
      ))}
    </Tabs>
  ) : (
    <></>
  )
}
