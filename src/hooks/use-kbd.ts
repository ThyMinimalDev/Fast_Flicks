import { useCallback } from 'react'
import { useEvent, useKey } from 'react-use'

type useKbdProps = {
  onEsc: () => void
  onInput: (key: string) => void
}

export const useKbd = ({ onInput, onEsc }: useKbdProps) => {
  useKey('Escape', onEsc, undefined, [onEsc])

  const onKeyDown = useCallback(
    ({ key, isTrusted }: { key: string; isTrusted: boolean }) => {
      if (isTrusted && key?.length === 1) {
        onInput(key)
      }
    },
    [onInput]
  )

  useEvent('keydown', onKeyDown)

  return {}
}
