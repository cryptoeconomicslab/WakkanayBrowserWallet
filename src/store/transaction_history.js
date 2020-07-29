import { formatEther } from 'ethers/utils'
import { createAction, createReducer } from '@reduxjs/toolkit'
import clientWrapper from '../client'
import { getTokenByTokenContractAddress } from '../constants/tokens'

export const setHistoryList = createAction('SET_HISTORY_LIST')

export const historyReducer = createReducer(
  {
    historyList: []
  },
  {
    [setHistoryList]: (state, action) => {
      state.historyList = action.payload
    }
  }
)

export const getTransactionHistories = () => {
  return async dispatch => {
    try {
      const client = await clientWrapper.getClient()
      if (!client) return
      const histories = (await client.getAllUserActions()).map(history => {
        const token = getTokenByTokenContractAddress(history.tokenAddress)
        return {
          message: history.type,
          amount: formatEther(history.amount.toString()),
          unit: token.unit,
          blockNumber: history.blockNumber.toString(),
          counterParty: history.counterParty,
          depositContractAddress: token.depositContractAddress,
          // TODO: update after publish light-client
          // range: { start: history.range.start, end: history.range.end }
          range: { start: '0', end: '0' }
        }
      })
      dispatch(setHistoryList(histories))
    } catch (error) {
      console.log(error)
    }
  }
}

// state = {
// currentFilter: "Filter ▽" | "Address" | "Tokens" | "ENS" | "Block #" | "Range"
//  }
