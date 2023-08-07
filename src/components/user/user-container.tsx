'use client'
import React, { FC, useEffect, useTransition } from 'react'
import { UserModal } from './user-modal'
import { UserWithHighscores } from '@/types/user'
import { useToggle } from 'react-use'
import { useBoundStore } from '@/state/use-bound-store'
import { updateUsername } from '@/actions/user'
import { useToast } from '../ui/use-toast'
import { UserForm, UserFormValues } from './user-form'
import { supbaseClientComponentClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type ModalProps = { user?: UserWithHighscores }

export const UserContainer: FC<ModalProps> = ({ user }) => {
  const [isModalOpen, toggleIsModalOpen] = useToggle(false)
  const setUser = useBoundStore(state => state.setUser)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const router = useRouter()
  const handleLogOut = async () => {
    await supbaseClientComponentClient.auth.signOut()
    router.refresh()
  }

  const handleUpdateUsername = (values: UserFormValues) =>
    startTransition(() =>
      updateUsername(values.username)
        .then(() => {
          toast({
            title: 'Username updated',
            description: 'Your public display name has been set',
          })
          if (user) setUser({ ...user, username: values.username })
        })
        .catch(err => {
          const isUniqueConstraint = err.toString().includes('Unique')
          toast({
            variant: 'destructive',
            title: isUniqueConstraint
              ? 'Username Already in Use'
              : 'Could not update username',
            description: 'Please select a different username to proceed.',
          })
        })
    )
  useEffect(() => {
    if (user) setUser(user)
  }, [user])

  useEffect(() => {
    if (Boolean(user && !user.username) && !isModalOpen) {
      toggleIsModalOpen(true)
    }
    if (Boolean(user && user.username) && isModalOpen) {
      toggleIsModalOpen(false)
    }
    if (!user) toggleIsModalOpen(false)
  }, [isModalOpen, toggleIsModalOpen, user])

  return (
    <UserModal isOpen={isModalOpen}>
      <UserForm
        onCancel={handleLogOut}
        onSubmit={handleUpdateUsername}
        disabled={isPending}
      />
    </UserModal>
  )
}
