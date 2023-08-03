'use client'
import React, { FC } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog'
import useStore from '@/hooks/useStore'
import { useBoundStore } from '@/state/useBoundStore'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LeaderboardTable } from './leaderboard-table'
import { WORDS_SETTINGS } from '@/constants/kbd'
import { ScoresByLeaderboardWithUser } from '@/types/leaderboard'
import { Button } from '../ui/button'

type ModalProps = { scoresByLeaderboard: ScoresByLeaderboardWithUser }

export const LeaderboardModal: FC<ModalProps> = ({ scoresByLeaderboard }) => {
  const wordsSettings = useStore(useBoundStore, state => state.wordsSetting) ?? 50
  const isOpenLeaderboard =
    useStore(useBoundStore, state => state.isOpenLeaderboard) ?? false
  const toggleLeaderboard = useBoundStore(state => state.toggleLeaderboard)
  return (
    <AlertDialog open={isOpenLeaderboard}>
      <AlertDialogContent
        className={`max-h-[97vh] min-w-[300px] overflow-auto sm:min-w-[600px]`}
        onEscapeKeyDown={toggleLeaderboard}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-4xl font-light">
            Leaderboard
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center font-light">
            Ranking by number of words.
          </AlertDialogDescription>
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
                <LeaderboardTable scores={scoresByLeaderboard[words]} words={words} />
              </TabsContent>
            ))}
          </Tabs>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={toggleLeaderboard}>Close</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
