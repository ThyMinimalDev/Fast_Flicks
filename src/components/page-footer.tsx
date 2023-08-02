import { CookieIcon, FileWarningIcon, GithubIcon, LinkedinIcon } from 'lucide-react'
import React, { FC } from 'react'
import { Separator } from './ui/separator'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { SPACE_SYMBOL } from '@/constants/kbd'

type FooterProps = {
  className?: string
}

export const PageFooter: FC<FooterProps> = ({ className }) => {
  return (
    <div className={cn('w-full px-9', className)}>
      <Separator className="mb-7" />
      <div className="mb-6 flex flex-row justify-between text-sm">
        <div>Copyright 2023 Fast{SPACE_SYMBOL}Flicks</div>

        <div className="flex flex-row items-center justify-center gap-4">
          <Link href="/disclaimers" target="_blank">
            <FileWarningIcon className="cursor-pointer" width={24} height={24} />
          </Link>
          <Link href="/privacy-policy" target="_blank">
            <CookieIcon className="cursor-pointer" width={24} height={24} />
          </Link>
          <a href="https://github.com/ThyMinimalDev/Fast_Flicks" target="_blank">
            <GithubIcon className="cursor-pointer" width={24} height={24} />
          </a>
          <a
            href="https://www.linkedin.com/in/morgan-vernay-3b674310a/?locale=en_US"
            target="_blank"
          >
            <LinkedinIcon className="cursor-pointer" width={24} height={24} />
          </a>
        </div>
      </div>
    </div>
  )
}
