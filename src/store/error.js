import { createAction, createReducer } from '@reduxjs/toolkit'

export const pushError = createAction('PUSH_ERROR')
export const removeError = createAction('REMOVE_ERROR')

export const errorReducer = createReducer(
  {
    errors: []
  },
  {
    [pushError]: (state, action) => {
      if (!state.errors.includes(action.payload)) {
        state.errors = [...state.errors, action.payload]
      }
    },
    [removeError]: (state, action) => {
      state.errors = state.errors.filter(err => err !== action.payload)
    }
  }
)
