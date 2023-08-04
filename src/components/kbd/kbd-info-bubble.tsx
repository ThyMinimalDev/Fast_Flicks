import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { InfoIcon } from 'lucide-react'
import React, { FC } from 'react'
import { MemoizedKeyboard } from '@/components/ui/keyboard'

type InfoBubbleProps = {
  isFirstVisit?: boolean
  handleChange: (open: boolean) => void
}

const KBDInfoBubble: FC<InfoBubbleProps> = ({ handleChange, isFirstVisit }) => {
  return (
    <Popover defaultOpen={isFirstVisit} onOpenChange={handleChange}>
      <PopoverTrigger asChild>
        <InfoIcon
          className="h-5 w-5 cursor-pointer aria-expanded:stroke-2 sm:h-7 sm:w-7"
          strokeWidth={1.1}
        />
      </PopoverTrigger>
      <PopoverContent className="mt-1 flex flex-col gap-2 p-2" side="bottom">
        <div className="flex flex-row items-center">
          <MemoizedKeyboard
            className="h-6 w-6 text-xs sm:h-8 sm:w-8 sm:text-sm"
            value="ESC"
            isError={false}
          />

          <span className="mx-1">:</span>
          <span className="text-sm sm:text-base">Restart the test</span>
        </div>
        <div className="flex flex-row items-center gap-1">
          <MemoizedKeyboard
            className="h-6 w-6 text-xs sm:h-8 sm:w-8 sm:text-sm"
            value="ALT"
            isError={false}
          />
          +
          <MemoizedKeyboard
            className="h-6 w-6 text-xs sm:h-8 sm:w-8 sm:text-sm"
            value="K"
            isError={false}
          />
          <span className="mx-1">:</span>
          <span className="text-sm sm:text-base">Quick Access</span>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export const MemoizedKBDInfoBubble = React.memo(KBDInfoBubble)
