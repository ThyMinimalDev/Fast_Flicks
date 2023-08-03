import { cn } from '@/lib/utils'
import React, { FC } from 'react'
import { MemoizedKeyboard as Keyboard } from '@/components/ui/keyboard'
import { InputType } from '@/types/kbd'

type InputsProps = {
  inputs: InputType[]
  firstLetter?: string
}

export const KBDInputs: FC<InputsProps> = ({ inputs, firstLetter }) => {
  return (
    <div className="flex h-9 w-11/12 select-none flex-row gap-1 overflow-hidden md:gap-4">
      {Boolean(inputs.length) ? (
        inputs.map((input, index) => (
          <div
            key={`${input.value}-${input.id}`}
            className={cn(
              index === inputs.length - 1 &&
                'duration-150 animate-in  slide-in-from-bottom-1',
              input.isError && 'text-sun-error dark:text-moon-error'
            )}
          >
            <Keyboard value={input.value} isError={false} />
          </div>
        ))
      ) : (
        <div className="flex flex-row gap-2 text-xs sm:text-base">
          {firstLetter && (
            <>
              Press
              <Keyboard value={firstLetter} isError={false} /> on your keyboard to start
              the test.
            </>
          )}
        </div>
      )}
    </div>
  )
}
