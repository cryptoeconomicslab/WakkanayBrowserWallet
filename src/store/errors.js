import { createAction, createReducer } from '@reduxjs/toolkit'

export const addError = createAction('ADD_ERROR')
export const clearAllErrors = createAction('CLEAR_ALL_ERRORS')

const initialState = {
  errors: []
}
export const errorsReducer = createReducer(initialState, {
  [addError]: (state, action) => {
    state.errors = [...state.errors, action.payload]
  },
  [clearAllErrors]: () => {
    return initialState
  }
})
