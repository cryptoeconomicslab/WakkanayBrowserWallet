import { formatEther } from 'ethers/utils'
import { createAction, createReducer } from '@reduxjs/toolkit'
import clientWrapper from '../client'
import { getTokenByTokenContractAddress } from '../constants/tokens'

export const setHistoryList = createAction('SET_HISTORY_LIST')
export const errorSetHistoryList = createAction('ERROR_SET_HISTORY_LIST')

export const historyReducer = createReducer(
  {
    historyList: [],
    errorHistoryList: false
  },
  {
    [setHistoryList]: (state, action) => {
      state.historyList = action.payload
    },
    [errorSetHistoryList]: (state, action) => {
      state.errorHistoryList = action.payload
    }
  }
)

export const getTransactionHistories = () => {
  return async dispatch => {
    try {
      const client = await clientWrapper.getClient()
      if (!client) return
      const histories = (await client.getAllUserActions()).map(history => {
        return {
          message: history.type,
          amount: formatEther(history.amount.toString()),
          unit: getTokenByTokenContractAddress(history.tokenAddress).unit,
          blockNumber: history.blockNumber.toString()
        }
      })
      dispatch(setHistoryList(histories))
    } catch (error) {
      console.error(error)
      dispatch(errorSetHistoryList(true))
    }
  }
}

// state = {
// currentFilter: "Filter ▽" | "Address" | "Tokens" | "ENS" | "Block #" | "Range"
//  }
