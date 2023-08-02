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
        <InfoIcon className="cursor-pointer aria-expanded:stroke-2" strokeWidth={1.1} />
      </PopoverTrigger>
      <PopoverContent className="mt-1 p-4">
        <div className="flex flex-row items-center">
          <MemoizedKeyboard className="w-10 text-base" value="ESC" isError={false} />
          <span className="mx-1">:</span>
          <span>Restart the test</span>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export const MemoizedKBDInfoBubble = React.memo(KBDInfoBubble)
