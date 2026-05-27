'use server'
import { prisma } from '@/lib/prisma'
import { getSupabaseServerClient } from '@/lib/supabase-server'
import { UserWithHighscores } from '@/types/user'
import { revalidatePath } from 'next/cache'

export async function updateUsername(username: string) {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.id) {
    throw new Error('Unauthorized')
  }

  try {
    const result = await prisma.user.update({
      where: { id: user.id },
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
  if (!id) {
    throw new Error('Missing auth user id')
  }
  try {
    return await prisma.user.findUnique({
      where: { id },
      include: { highscores: true },
    })
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function createUser(id: string): Promise<UserWithHighscores> {
  if (!id) {
    throw new Error('Missing auth user id')
  }
  try {
    return await prisma.user.create({
      data: { id, username: undefined },
      include: { highscores: true },
    })
  } catch (err) {
    console.error(err)
    throw err
  }
}

export async function getOrCreateUser(id: string): Promise<UserWithHighscores> {
  if (!id) {
    throw new Error('Missing auth user id')
  }
  const existing = await getUser(id)
  if (existing?.id) return existing
  return createUser(id)
}
