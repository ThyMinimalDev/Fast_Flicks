'use client'
import React, { FC } from 'react'
import { AuthModal } from './auth-modal'
import { useBoundStore } from '@/state/use-bound-store'
import { useStore } from 'zustand'
import { useAuth } from '@/hooks/use-auth'

type AuthProps = {
  isAuth: boolean
}

export const AuthContainer: FC<AuthProps> = ({ isAuth }) => {
  const { handleOAuth } = useAuth()
  const isOpenLoginModal =
    useStore(useBoundStore, state => state.isOpenLoginModal) ?? false
  const toggleModal = useBoundStore(state => state.setIsOpenLoginModal)

  return !isAuth ? (
    <AuthModal onAuth={handleOAuth} isOpen={isOpenLoginModal} onClose={toggleModal} />
  ) : (
    <></>
  )
}
