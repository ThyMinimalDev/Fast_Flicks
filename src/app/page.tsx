import { KBD } from '@/components/kbd/kbd-container'
import { cn } from '@/lib/utils'

export default async function Home() {
  return (
    <main>
      <div
        className={cn('duration-500 ease-in-out animate-in fade-in-0 fill-mode-forwards')}
      >
        <KBD />
      </div>
    </main>
  )
}
