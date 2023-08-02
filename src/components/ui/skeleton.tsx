import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-sun-accent opacity-20 dark:bg-moon-accent',
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
