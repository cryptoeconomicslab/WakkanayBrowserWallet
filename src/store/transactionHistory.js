import { formatEther } from 'ethers/utils'
import { createAction, createReducer } from '@reduxjs/toolkit'
import clientWrapper from '../client'
import { getTokenByTokenContractAddress } from '../constants/tokens'

export const setHistoryList = createAction('SET_HISTORY_LIST')
export const setHistoryListError = createAction('SET_HISTORY_LIST_ERROR')

export const historyReducer = createReducer(
  {
    historyList: [],
    historyListError: false
  },
  {
    [setHistoryList]: (state, action) => {
      state.historyList = action.payload
    },
    [setHistoryListError]: (state, action) => {
      state.historyListError = action.payload
    }
  }
)

export const getTransactionHistories = () => {
  return async dispatch => {
    try {
      dispatch(setHistoryListError(false))
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
      dispatch(setHistoryListError(true))
    }
  }
}

// state = {
// currentFilter: "Filter ▽" | "Address" | "Tokens" | "ENS" | "Block #" | "Range"
//  }
