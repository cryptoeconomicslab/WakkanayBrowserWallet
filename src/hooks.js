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

export function useReactToast({ errors, removeError }) {
  const { addToast, toastStack } = useToasts()
  const prev = usePrevious({ errors, toastStack })

  useEffect(() => {
    if (
      (!prev && errors.length) ||
      (prev && errors.length > prev.errors.length)
    ) {
      addToast(errors[errors.length - 1], { appearance: 'error' })
    }
  }, [errors])

  useEffect(() => {
    if (prev && toastStack.length < prev.toastStack.length) {
      const diff = _.difference(prev.toastStack, toastStack)
      removeError(diff[0].content)
    }
  }, [toastStack])
}