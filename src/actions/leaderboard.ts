'use server'
import { prisma } from '@/lib/prisma'
import { getSupabaseServerClient } from '@/lib/supabase-server'
import { Leaderboard } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function upsertHighscore(
  data: Pick<Leaderboard, 'score' | 'acc' | 'language' | 'words' | 'wpm'>
) {
  const { score, acc, wpm, words, language } = data

  const supabase = await getSupabaseServerClient()
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser?.id) {
    throw new Error('Unauthorized')
  }

  const userRecord = await prisma.user.findUnique({
    where: { id: authUser.id },
    include: {
      highscores: { where: { words, language } },
    },
  })

  if (!userRecord?.username) {
    throw new Error('Username not set')
  }

  const currentHighscore = userRecord.highscores[0]?.score ?? 0
  if (currentHighscore >= score) {
    throw new Error('Not a new highscore')
  }

  await prisma.leaderboard.upsert({
    where: { userId_words_language: { userId: authUser.id, words, language } },
    update: { score, wpm, acc },
    create: { wpm, acc, score, userId: authUser.id, words, language },
  })
  revalidatePath('/')
}
