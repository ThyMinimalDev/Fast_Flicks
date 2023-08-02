'use server'
import { prisma } from '@/lib/prisma'
import { UserWithHighscores } from '@/types/user'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export async function updateUsername(username: string) {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()
  try {
    const result = await prisma.user.update({
      where: { id: session?.user.id },
      data: { username },
    })

    if (!result || result.username !== username) {
      throw new Error('Could not update username')
    }
    revalidatePath('/')
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function getUser(id: string): Promise<UserWithHighscores | null> {
  try {
    if (!id) {
      throw new Error('Missing auth user id')
    }
    const user = await prisma.user.findUnique({
      where: { id },
      include: { highscores: true },
    })
    return user
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function createUser(id: string): Promise<UserWithHighscores> {
  try {
    if (!id) {
      throw new Error('Missing auth user id')
    }
    const user = await prisma.user.create({
      data: { id: id, username: undefined },
      include: { highscores: true },
    })
    return user
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function getOrCreateUser(id: string): Promise<UserWithHighscores> {
  try {
    if (!id) {
      throw new Error('Missing auth user id')
    }
    let user = await getUser(id)
    if (user?.id) return user

    return await createUser(id)
  } catch (err) {
    console.error(err)
    throw err
  }
}
