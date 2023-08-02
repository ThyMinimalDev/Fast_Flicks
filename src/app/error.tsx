'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-sun-accent dark:text-moon-accent">
      <h2>Something went wrong!</h2>
      <button
        onClick={() => router.refresh()}
        className="rounded-md border border-sun-accent p-4 dark:border-moon-accent"
      >
        Try again
      </button>
    </div>
  )
}
