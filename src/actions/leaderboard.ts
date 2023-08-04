'use server'
import { prisma } from '@/lib/prisma'
import { LanguageSetting, WordsCountSettings } from '@/types/kbd'
import { UserWithHighscores } from '@/types/user'
import { revalidatePath } from 'next/cache'

export async function upsertHighscore(
  user: UserWithHighscores,
  wpm: number,
  acc: number,
  score: number,
  words: WordsCountSettings,
  language: LanguageSetting
) {
  try {
    if (!user) {
      throw Error('User is not Auth')
    }
    await prisma.leaderboard.upsert({
      where: { userId_words: { userId: user.id, words } },
      update: {
        score,
        wpm,
        acc,
      },
      create: {
        wpm,
        acc,
        score,
        userId: user.id,
        words,
        language,
      },
    })
    revalidatePath('/')
  } catch (err) {
    console.error(err)
  }
}
