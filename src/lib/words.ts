import { commonWords as mostUsedEnglishWords } from '@/data/en'
import { randomIntFromInterval } from './utils'
import { SPACE_SYMBOL } from '@/constants/kbd'
import { EN_LANGUAGE } from '@/constants/ui'

export const getWords = (maxWordsCount: number, language = EN_LANGUAGE): string[] => {
  const maxCharacters = maxWordsCount - 1 + maxWordsCount * 5 // spaces + average word is 5 characters long
  let characterCount = 0
  const words = [...mostUsedEnglishWords]
  const result: string[] = []

  const generateWord = () => {
    const number = randomIntFromInterval(0, words.length - 1)
    const word = words[number].toLocaleLowerCase()
    words.splice(number, 1) // remove word from array to avoid duplicates
    return word
  }

  for (let index = 0; index < maxWordsCount; index++) {
    if (characterCount > maxCharacters) {
      break
    }

    const word = generateWord()
    characterCount += word.length

    if (index === maxWordsCount - 1 || characterCount >= maxCharacters) {
      result.push(word)
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
