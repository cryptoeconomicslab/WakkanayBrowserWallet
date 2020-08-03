import { createAction, createReducer } from '@reduxjs/toolkit'

export const pushToast = createAction('PUSH_TOAST')
export const removeToast = createAction('REMOVE_TOAST')

export const toastReducer = createReducer(
  {
    toasts: []
  },
  {
    [pushToast]: (state, action) => {
      if (!state.toasts.includes(action.payload)) {
        state.toasts = [...state.toasts, action.payload]
      }
    },
    [removeToast]: (state, action) => {
      state.toasts = state.toasts.filter(err => err !== action.payload)
    }
  }
)
