import { SPACE_SYMBOL } from '@/constants/kbd'
import { cn } from '@/lib/utils'
import React from 'react'

type KeyboardProps = {
  value: string
  isError: boolean
  className?: string
}

const Keyboard = ({ value, isError, className = '' }: KeyboardProps) => {
  return (
    <div
      className={cn(
        isError && 'text-sun-error dark:text-moon-error',
        'flex h-5 w-5 flex-col items-center justify-center rounded-md border text-sm leading-[2em] sm:h-7 sm:w-7 sm:text-lg',
        className
      )}
    >
      <div
        className={cn(
          value === SPACE_SYMBOL && '-translate-y-1',
          ['g', 'p', 'j'].includes(value) && '-translate-y-0.5'
        )}
      >
        {value}
      </div>
    </div>
  )
}

export const MemoizedKeyboard = React.memo(Keyboard)
