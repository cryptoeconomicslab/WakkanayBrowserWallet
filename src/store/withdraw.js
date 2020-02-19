import { createAction, createReducer } from '@reduxjs/toolkit'
import clientWrapper from '../client'

export const setWithdrawnToken = createAction('SET_WITHDRAWN_TOKEN')
export const setWithdrawPage = createAction('SET_WITHDRAW_PAGE')

export const withdrawReducer = createReducer(
  {
    withdrawnToken: 'Ethereum',
    withdrawPage: 'input-page'
  },
  {
    [setWithdrawnToken]: (state, action) => {
      state.withdrawnToken = action.payload
    },
    [setWithdrawPage]: (state, action) => {
      state.withdrawPage = action.payload
    }
  }
)

export const withdraw = amount => {
  return async dispatch => {
    try {
      const client = await clientWrapper.getClient()
      if (!client) return
      await client.withdraw(amount)
      dispatch(setWithdrawPage('completion-page'))
    } catch (error) {
      console.log(error)
    }
  }
}
