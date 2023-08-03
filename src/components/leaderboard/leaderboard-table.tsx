import React, { FC } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { LeaderboardWithUser } from '@/types/leaderboard'
import { useStore } from 'zustand'
import { useBoundStore } from '@/state/useBoundStore'
import { cn } from '@/lib/utils'

const scoresTemplate = [...new Array(5)]

type RowProps = {
  position: number
  username?: string | null
  wpm?: number
  acc?: number
  score?: number
  className?: string
}
const Row: FC<RowProps> = ({ acc, wpm, position, score, username, className }) => (
  <TableRow className={cn('border-b-0', className)}>
    <TableCell className="text-left font-medium">#{position}</TableCell>
    <TableCell className="text-left font-medium">{username ?? '-----'}</TableCell>
    <TableCell className="hidden text-left sm:table-cell"> {wpm ?? '---'}</TableCell>
    <TableCell className="hidden text-center sm:table-cell">{acc ?? '--'}%</TableCell>
    <TableCell className="text-right">{score ? Math.round(score) : '-----'}</TableCell>
  </TableRow>
)

const MemoizedRow = React.memo(Row)

type TableProps = {
  scores?: LeaderboardWithUser[]
  words: number
}

export const LeaderboardTable: FC<TableProps> = ({ scores, words }) => {
  const user = useStore(useBoundStore, state => state.user)
  const isInTop5 = Boolean(
    user?.id ? scores?.some(highscore => highscore.user.id === user.id) : false
  )
  const currentUserHighscore = !isInTop5
    ? user?.highscores.find(score => score.words === words)
    : null
  return (
    <Table>
      <TableHeader className="[&_tr]:border-b-0">
        <TableRow className="border-b-0 ">
          <TableHead className="text-left"></TableHead>
          <TableHead className="text-left">Name</TableHead>
          <TableHead className="hidden text-left sm:table-cell">WPM</TableHead>
          <TableHead className="hidden text-center sm:table-cell">ACC</TableHead>
          <TableHead className="text-right">Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="overflow-auto">
        {scoresTemplate.map((_, index) => {
          const highscore = scores?.[index]
          return (
            <MemoizedRow
              key={'highscore' + highscore?.id + highscore?.userId + index}
              acc={highscore?.acc}
              wpm={highscore?.wpm}
              username={highscore?.user?.username}
              position={index + 1}
              score={highscore?.score}
            />
          )
        })}
        {user && currentUserHighscore && (
          <MemoizedRow
            acc={currentUserHighscore.acc}
            wpm={currentUserHighscore.wpm}
            username={user?.username}
            position={currentUserHighscore.position}
            score={currentUserHighscore.score}
            className="animate-pulse repeat-[3] [&>*:first-child]:underline"
          />
        )}
      </TableBody>
    </Table>
  )
}
