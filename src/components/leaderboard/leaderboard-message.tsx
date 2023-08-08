'use client'
import { useBoundStore } from '@/state/use-bound-store'
import React, { FC } from 'react'

type MessageProps = {
  isAuth: boolean
}

export const LeaderboardMessage: FC<MessageProps> = ({ isAuth }) => {
  const toggleLoginModal = useBoundStore(state => state.setIsOpenLoginModal)

  return !isAuth ? (
    <div className="w-full py-2 text-center text-xs">
      Please{' '}
      <span className="cursor-pointer underline" onClick={toggleLoginModal}>
        Sign-In
      </span>{' '}
      if you want to participate in the leaderboard.
    </div>
  ) : (
    <></>
  )
}
