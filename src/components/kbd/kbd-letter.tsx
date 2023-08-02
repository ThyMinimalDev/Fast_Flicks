import { SPACE_SYMBOL } from '@/constants/kbd'
import { cn } from '@/lib/utils'
import React, { FC } from 'react'

type LetterProps = {
  letter: string
  isCurrentLetter: boolean
  isDone: boolean
  isError: boolean
}
const KBDLetter: FC<LetterProps> = ({ letter, isCurrentLetter, isDone, isError }) => {
  return (
    <div
      className={cn(
        'relative inline-block leading-8',
        letter === SPACE_SYMBOL && 'mx-0.5 mt-1 text-sm',
        isCurrentLetter && 'font-normal',
        isDone && 'opacity-90',
        !isDone && isError && 'error-shake',
        isDone && isError && 'text-sun-error dark:text-moon-error'
      )}
    >
      {isCurrentLetter && (
        <div
          className={cn(
            'pointer-events-none animate-pulse select-none duration-1000',
            'absolute -left-1.5 text-xl font-light',
            letter === SPACE_SYMBOL && '-translate-y-1.5'
          )}
        >
          |
        </div>
      )}
      {letter === SPACE_SYMBOL ? (
        <div className="mx-0.5 -translate-y-0.5 align-text-top text-lg leading-tight">
          {SPACE_SYMBOL}
        </div>
      ) : (
        letter
      )}
    </div>
  )
}

export const MemoizedKBDLetter = React.memo(KBDLetter)
