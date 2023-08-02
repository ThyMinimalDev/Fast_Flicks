import { BarChart2 } from 'lucide-react'
import React, { FC } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

type StatsProps = {
  WPM: number
  ACC: number
}
const KBDStats: FC<StatsProps> = ({ WPM, ACC }) => {
  return (
    <div className="flex flex-row items-center gap-1.5">
      <Tooltip>
        <TooltipTrigger className="cursor-default">
          <span>{WPM || '--'} WPM </span>{' '}
        </TooltipTrigger>
        <TooltipContent>
          <p className="flex flex-row items-center gap-0.5 [word-spacing:-3px]">
            <span>Words per minute</span>
          </p>
        </TooltipContent>
      </Tooltip>
      <span>/</span>{' '}
      <span className="">
        {ACC || '--'}
        <span className="ml-0.5">%</span>
      </span>{' '}
      <Tooltip>
        <TooltipTrigger className="cursor-default">ACC </TooltipTrigger>
        <TooltipContent>
          <p className="flex flex-row items-center gap-0.5 [word-spacing:-3px]">
            <span>Accuracy</span>
          </p>
        </TooltipContent>
      </Tooltip>
      <BarChart2 width={18} height={18} className=" pointer-events-none" />
    </div>
  )
}

export const MemoizedKBDStats = React.memo(KBDStats)
