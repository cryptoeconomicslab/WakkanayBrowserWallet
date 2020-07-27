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
    const prevToasts = !prev ? [] : prev.toasts
    if (toasts.length > prevToasts.length) {
      const diff = _.difference(toasts, prevToasts)
      diff.forEach(toastContent => {
        addToast(toastContent, { appearance: type })
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
