'use client'
import React, { FC, ReactNode } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog'
import useStore from '@/hooks/use-store'
import { useBoundStore } from '@/state/use-bound-store'
import { Button } from '../ui/button'
import { EN_LANGUAGE } from '@/constants/ui'

type ModalProps = {
  children: ReactNode
}

export const LeaderboardModal: FC<ModalProps> = ({ children }) => {
  const language = useStore(useBoundStore, state => state.language) ?? EN_LANGUAGE
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
            Leaderboard ({language})
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center font-light">
            Ranking by number of words.
          </AlertDialogDescription>
          {children}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={toggleLeaderboard}>Close</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
