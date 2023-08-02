'use client'

import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import React, { FC, useEffect, useRef } from 'react'

export const TabRefocusDataRefresher: FC = () => {
  const router = useRouter()
  const blurTimeStampRef = useRef(0)

  useEffect(() => {
    const onFocus = (_: FocusEvent) => {
      if (blurTimeStampRef.current) {
        const now = Date.now()
        const timeBlurred = dayjs(now).diff(
          dayjs(blurTimeStampRef.current),
          'minute',
          true
        )
        // if user away from tab for more than 5 minutes, refresh
        if (timeBlurred > 5) {
          router.refresh()
        }
        blurTimeStampRef.current = 0
      }
    }
    const onBlur = (_: FocusEvent) => {
      blurTimeStampRef.current = Date.now()
    }
    addEventListener('focus', onFocus)
    addEventListener('blur', onBlur)

    return () => {
      removeEventListener('focus', onFocus)
      removeEventListener('blur', onBlur)
    }
  })

  return <></>
}
