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

import { Button } from '@/components/ui/button'
import { ChromeIcon, FacebookIcon, LinkedinIcon } from 'lucide-react'
import { Provider } from '@supabase/supabase-js'

type AuthProps = {
  isOpen: boolean
  onAuth: (provider: Provider) => () => Promise<void>
  onClose: () => void
}
export const AuthModal: FC<AuthProps> = ({ isOpen, onAuth, onClose }) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent
        className={`max-h-[97vh] min-w-[400px] overflow-auto sm:min-w-[500px] md:min-w-[600px]`}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-4xl font-light">
            Sign-In
          </AlertDialogTitle>
          <AlertDialogDescription className="pt-4 text-center font-light">
            Connect in order to save your highscores in the leaderboard.
          </AlertDialogDescription>
          <div className="flex w-full flex-col items-center justify-center gap-4 pt-4">
            <Button onClick={onAuth('google')}>
              <ChromeIcon className="mr-2 hover:stroke-[1.25px]" width={18} height={18} />{' '}
              <span className="w-60 stroke-2 text-lg">Sign in with Google</span>
            </Button>
            <Button onClick={onAuth('facebook')}>
              <FacebookIcon className="mr-2" width={18} height={18} />{' '}
              <span className="w-60 stroke-2 text-lg">Sign in with Facebook</span>
            </Button>
            <Button onClick={onAuth('linkedin')}>
              <LinkedinIcon className="mr-2" width={18} height={18} />{' '}
              <span className="w-60 stroke-2 text-lg">Sign in with LinkedIn</span>
            </Button>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button autoFocus={false} onClick={onClose}>
            Close
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
