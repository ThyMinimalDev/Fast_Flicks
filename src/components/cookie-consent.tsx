'use client'
import { useEffect } from 'react'
import { useToggle } from 'react-use'
import posthog from 'posthog-js'
import { Button } from './ui/button'

export const CookieConsent = () => {
  const [showCookieConsent, toggleCookieConsent] = useToggle(false)

  const acceptCookies = () => {
    posthog.opt_in_capturing()
    toggleCookieConsent(false)
  }

  const declineCookies = () => {
    posthog.opt_out_capturing()
    toggleCookieConsent(false)
  }

  useEffect(() => {
    if (posthog.has_opted_in_capturing() || posthog.has_opted_out_capturing()) {
      toggleCookieConsent(false)
    } else {
      toggleCookieConsent(true)
    }
  }, [toggleCookieConsent])

  return showCookieConsent ? (
    <div className="absolute bottom-0.5 box-border flex w-[99.7vw] flex-col items-center justify-center  border border-sun-accent bg-sun-background p-4 dark:border-moon-accent dark:bg-moon-background">
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm sm:text-base 2xl:text-lg">
          We use tracking cookies to understand how you use the product and help us
          improve it. Please accept cookies to help us improve.
        </p>
        <div className="flex flex-row gap-4">
          <Button type="button" onClick={acceptCookies}>
            Accept Cookies
          </Button>
          <Button type="button" onClick={declineCookies}>
            Decline Cookies
          </Button>
        </div>
      </div>
    </div>
  ) : (
    <></>
  )
}
