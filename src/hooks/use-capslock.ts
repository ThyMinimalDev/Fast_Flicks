import { useEvent, useToggle } from 'react-use'
import { ToastObject, useToast } from '@/components/ui/use-toast'
let capsLockToast: ToastObject | undefined = undefined

export const useCapslock = () => {
  const { toast } = useToast()

  const [capsLocked, toggleCapsLock] = useToggle(false)
  useEvent('keyup', event => {
    if (!capsLocked && event.getModifierState('CapsLock')) {
      toggleCapsLock(true)
      capsLockToast = toast({
        title: 'Caps Lock On!',
        description: 'it may stop you from doing the test',
      })
    }
    if (capsLocked && !event.getModifierState('CapsLock')) {
      if (capsLocked && capsLockToast) toggleCapsLock(false)
      capsLockToast?.dismiss()
      capsLockToast = undefined
    }
  })
  return capsLocked
}
