import { useRef, useEffect } from 'react'
import _ from 'lodash'
import { useToasts } from 'react-toast-notifications'

export function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

export function useReactToast({ toasts, onDisappearToast, type = 'error' }) {
  const { addToast, toastStack } = useToasts()
  const prev = usePrevious({ toasts, toastStack })

  useEffect(() => {
    if (
      (!prev && toasts.length) ||
      (prev && toasts.length > prev.toasts.length)
    ) {
      addToast(toasts[toasts.length - 1], { appearance: type })
    }
  }, [toasts])

  useEffect(() => {
    if (prev && toastStack.length < prev.toastStack.length) {
      const diff = _.difference(prev.toastStack, toastStack)
      onDisappearToast(diff[0].content)
    }
  }, [toastStack])
}
