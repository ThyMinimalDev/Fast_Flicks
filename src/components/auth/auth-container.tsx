'use client'
import React, { FC } from 'react'
import { AuthModal } from './auth-modal'
import { useBoundStore } from '@/state/use-bound-store'
import { useStore } from 'zustand'
import { Provider } from '@supabase/supabase-js'
import { supbaseClientComponentClient } from '@/lib/supabase'

type AuthProps = {
  isAuth: boolean
}

export const AuthContainer: FC<AuthProps> = ({ isAuth }) => {
  const supabase = supbaseClientComponentClient
  const handleOAuth = (provider: Provider) => async () => {
    await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }
  const isOpenLoginModal =
    useStore(useBoundStore, state => state.isOpenLoginModal) ?? false
  const toggleModal = useBoundStore(state => state.setIsOpenLoginModal)

  return !isAuth ? (
    <AuthModal onAuth={handleOAuth} isOpen={isOpenLoginModal} onClose={toggleModal} />
  ) : (
    <></>
  )
}
