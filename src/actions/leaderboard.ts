'use server'
import { prisma } from '@/lib/prisma'
import { UserWithHighscores } from '@/types/user'
import { Leaderboard } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function upsertHighscore(
  data: Pick<Leaderboard, 'score' | 'acc' | 'language' | 'words' | 'wpm'>,
  user?: UserWithHighscores
) {
  try {
    const { score, acc, wpm, words, language } = data

    if (!user) {
      throw Error('User is not set')
    }
    const currentHighscore =
      user.highscores.find(score => score.words === words && score.language === language)
        ?.score ?? 0

    if (currentHighscore >= score) {
      throw Error('Not a new Highscore')
    }
    await prisma.leaderboard.upsert({
      where: { userId_words_language: { userId: user.id, words, language } },
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
    throw err
  }
}
