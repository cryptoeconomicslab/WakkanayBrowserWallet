import { createAction, createReducer } from '@reduxjs/toolkit'
import { ActionType } from './types'

export enum TOAST_ACTION_TYPES {
  PUSH_TOAST = 'PUSH_TOAST',
  REMOVE_TOAST = 'REMOVE_TOAST'
}

export interface State {
  toasts: string[]
}

const initialState: State = {
  toasts: []
}

export const pushToast = createAction<{ message: string; type: string }>(
  TOAST_ACTION_TYPES.PUSH_TOAST
)
export const removeToast = createAction<string>(TOAST_ACTION_TYPES.REMOVE_TOAST)

const reducer = createReducer(initialState, {
  [pushToast.type]: (state: State, action: ActionType<TOAST_ACTION_TYPES>) => {
    if (!state.toasts.includes(action.payload)) {
      state.toasts = [...state.toasts, action.payload]
    }
  },
  [removeToast.type]: (
    state: State,
    action: ActionType<TOAST_ACTION_TYPES>
  ) => {
    state.toasts = state.toasts.filter(err => err !== action.payload)
  }
})

export default reducer
