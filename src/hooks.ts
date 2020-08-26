import { useRef, useEffect } from 'react'
import _ from 'lodash'
import { useToasts } from 'react-toast-notifications'

type ToastStack = {
  toasts: any
  toastStack: any
}

export function usePrevious(value: ToastStack): ToastStack | undefined {
  const ref = useRef<ToastStack>()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

export function useReactToast({ toasts, onDisappearToast }): void {
  const { addToast, toastStack } = useToasts()
  const prev = usePrevious({ toasts, toastStack })

  useEffect(() => {
    const prevToasts = !prev ? [] : prev.toasts
    if (toasts.length > prevToasts.length) {
      const diff = _.difference(toasts, prevToasts)
      diff.forEach(toastContent => {
        addToast(toastContent.message, { appearance: toastContent.type })
      })
    }
  }, [toasts])

  useEffect(() => {
    if (prev && toastStack.length < prev.toastStack.length) {
      const diff = _.difference(prev.toastStack, toastStack)
      diff.forEach(({ content }) => {
        onDisappearToast(content)
      })
    }
  }, [toastStack])
}
