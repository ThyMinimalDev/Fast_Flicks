import { cn } from '@/lib/utils'
import { WordsCountSettings } from '@/types/kbd'
import { SettingsIcon } from 'lucide-react'
import React, { FC } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { DEFAULT_WORDS_SETTING, WORDS_SETTINGS } from '@/constants/kbd'

type SettingsProps = {
  wordCount: number
  onChangeWordCount: (count: WordsCountSettings) => void
}

const KBDSettings: FC<SettingsProps> = ({
  wordCount = DEFAULT_WORDS_SETTING,
  onChangeWordCount,
}) => {
  return (
    <div className="flex flex-row items-center gap-1 text-xs sm:text-base">
      <SettingsIcon
        width={18}
        height={18}
        className="pointer-events-none mr-0.5 mt-0.5"
      />

      {WORDS_SETTINGS.map((word, index, arr) => (
        <div className="flex flex-row gap-1" key={word + '-setting'}>
          <Tooltip>
            <TooltipTrigger>
              <div
                onClick={() => {
                  onChangeWordCount(word)
                }}
                className={cn(
                  'cursor-pointer hover:font-medium',
                  wordCount === word && 'underline underline-offset-2'
                )}
              >
                {word}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="flex flex-row items-center gap-0.5 [word-spacing:-3px]">
                <span className="pt-0.5 text-xs font-extralight text-sun-accent  dark:text-moon-accent ">
                  ≈
                </span>
                <span>{word * 5} characters</span>
              </p>
            </TooltipContent>
          </Tooltip>

          {index !== arr.length - 1 && <div>/</div>}
        </div>
      ))}
      <div className="ml-0.5">Words</div>
    </div>
  )
}

export const MemoizedKBDSettings = React.memo(KBDSettings)
