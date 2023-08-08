import { commonWords as mostUsedEnWords } from '@/data/en'
import { commonWords as mostUsedFrWords } from '@/data/fr'
import { commonWords as mostUsedRuWords } from '@/data/ru'
import { commonWords as mostUsedCnWords } from '@/data/cn'
import { commonWords as mostUsedJpWords } from '@/data/jp'
import { commonWords as mostUsedKrWords } from '@/data/kr'
import { commonWords as mostUsedEsWords } from '@/data/es'

import { randomIntFromInterval } from './utils'
import { SPACE_SYMBOL } from '@/constants/kbd'
import {
  EN_LANGUAGE,
  KR_LANGUAGE,
  ES_LANGUAGE,
  JP_LANGUAGE,
  RU_LANGUAGE,
  FR_LANGUAGE,
  CN_LANGUAGE,
} from '@/constants/ui'
import { LanguageSetting } from '@/types/kbd'

const pickCommonWords = (lang: LanguageSetting) => {
  switch (lang) {
    case EN_LANGUAGE:
      return mostUsedEnWords
    case FR_LANGUAGE:
      return mostUsedFrWords
    case KR_LANGUAGE:
      return mostUsedKrWords
    case JP_LANGUAGE:
      return mostUsedJpWords
    case RU_LANGUAGE:
      return mostUsedRuWords
    case ES_LANGUAGE:
      return mostUsedEsWords
    case CN_LANGUAGE:
      return mostUsedCnWords
    default:
      return mostUsedEnWords
  }
}

export const getWords = (
  maxWordsCount: number,
  language: LanguageSetting = EN_LANGUAGE
): string[] => {
  const maxCharacters = maxWordsCount - 1 + maxWordsCount * 5 // spaces + average word is 5 characters long
  let characterCount = 0
  const words = [...pickCommonWords(language)]
  const result: string[] = []

  const generateWord = () => {
    const number = randomIntFromInterval(0, words.length - 1)
    const word = words[number].toLocaleLowerCase()
    words.splice(number, 1) // remove word from array to avoid duplicates
    return word
  }

  for (let index = 0; index < maxWordsCount; index++) {
    const word = generateWord()
    characterCount += word.length
    if (index === maxWordsCount - 1 || characterCount >= maxCharacters) {
      result.push(word)
      break
    } else {
      result.push(word, SPACE_SYMBOL)
    }
  }

  return result
}

/**
 * Gross words per minute (GWPM) is a typing speed measurement that calculates
 * how many words a person can type in one minute without considering errors.
 */
export const getGrossWPM = (totalEntries: number, time: number) => {
  const entries = totalEntries / 5
  return entries / time
}

/**
 * Typing accuracy measures how many errors a person makes
 * while typing compared to the total number of characters typed.
 */
export const getAcc = (totalEntries: number, errorCount: number) => {
  const accuracy = 100 - (errorCount / totalEntries) * 100
  if (accuracy < 0) return 0
  if (accuracy > 100) return 100
  return accuracy
}
