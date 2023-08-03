'use client'

import React, { FC, ReactNode } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog'
import { useLifecycles, useToggle } from 'react-use'

type ModalProps = {
  isOpen: boolean
  children: ReactNode
}

export const UserModal: FC<ModalProps> = ({ isOpen, children }) => {
  const [mounted, toggledMounted] = useToggle(false)

  /**
   * initial render hydratation error can happen
   * if user refresh page before setting username
   * fix by only opening modal once everything is mounted
   */
  useLifecycles(() => {
    toggledMounted(true)
  })

  return (
    <AlertDialog open={mounted && isOpen}>
      <AlertDialogContent
        className={`max-h-[97vh] min-w-[300px] overflow-auto sm:min-w-[600px]`}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-4xl font-light">
            Pick your Username
          </AlertDialogTitle>
          <AlertDialogDescription className="pt-4 text-center font-light">
            Please set your public display name for the leaderboard
          </AlertDialogDescription>
        </AlertDialogHeader>
        {children}
      </AlertDialogContent>
    </AlertDialog>
  )
}
