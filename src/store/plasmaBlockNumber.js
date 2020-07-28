import { createAction, createReducer } from '@reduxjs/toolkit'

export const setCurrentBlockNumber = createAction('SET_CURRENT_BLOCK_NUMBER')

export const plasmaBlockNumberReducer = createReducer(
  {
    currentBlockNumber: 0
  },
  {
    [setCurrentBlockNumber]: (state, action) => {
      state.currentBlockNumber = action.payload
    }
  }
)
