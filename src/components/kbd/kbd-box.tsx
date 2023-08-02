import React, { FC } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { MemoizedKBDLetter as Letter } from './kbd-letter'
import { Skeleton } from '@/components/ui/skeleton'

type BoxProps = {
  words: string[]
  currentLetter: number
  errorMap: { [key: number]: boolean }
  wordsSettings?: number
}

const WordsSkeleton = () => (
  <>
    <Skeleton className="h-6 w-11/12" />
    <Skeleton className="h-6 w-10/12" />
    <Skeleton className="h-6 w-11/12" />
    <Skeleton className="h-6 w-10/12" />
  </>
)

export const KBDBox: FC<BoxProps> = ({ words, currentLetter, errorMap }) => {
  let renderedLetter = 0
  return (
    <Card className="border-black flex min-h-[200px] w-full flex-col justify-center rounded-xl border-2">
      {Boolean(words.length) ? (
        <CardContent className="flex select-none flex-row flex-wrap px-7 py-16 md:text-xl lg:text-2xl">
          {words.map((word, index) => {
            return (
              <div key={word + index}>
                {word.split('').map(letter => {
                  renderedLetter += 1
                  return (
                    <Letter
                      isError={errorMap[renderedLetter - 1] ?? false}
                      isDone={currentLetter > renderedLetter - 1}
                      isCurrentLetter={currentLetter === renderedLetter - 1}
                      key={'letter-no-' + renderedLetter}
                      letter={letter}
                    />
                  )
                })}
              </div>
            )
          })}
        </CardContent>
      ) : (
        <div className="flex w-full items-center justify-center space-x-4 py-16 opacity-50">
          <div className="w-full space-y-2 px-5">
            <WordsSkeleton />
          </div>
        </div>
      )}
    </Card>
  )
}
