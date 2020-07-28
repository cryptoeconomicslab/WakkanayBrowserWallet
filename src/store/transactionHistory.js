import { formatEther } from 'ethers/utils'
import { createAction, createReducer } from '@reduxjs/toolkit'
import clientWrapper from '../client'
import { getTokenByTokenContractAddress } from '../constants/tokens'
import { pushToast } from './toast'

export const TRANSACTION_HISTORY_PROGRESS = {
  UNLOADED: 'UNLOADED',
  LOADING: 'LOADING',
  LOADED: 'LOADED',
  ERROR: 'ERROR'
}

export const setHistoryList = createAction('SET_HISTORY_LIST')
export const setHistoryListStatus = createAction('SET_HISTORY_LIST_STATUS')

export const historyReducer = createReducer(
  {
    historyList: [],
    status: TRANSACTION_HISTORY_PROGRESS.UNLOADED
  },
  {
    [setHistoryList]: (state, action) => {
      state.historyList = action.payload
      state.status = TRANSACTION_HISTORY_PROGRESS.LOADED
    },
    [setHistoryListStatus]: (state, action) => {
      state.status = action.payload
    }
  }
)

export const getTransactionHistories = () => {
  return async dispatch => {
    try {
      dispatch(setHistoryListStatus(TRANSACTION_HISTORY_PROGRESS.LOADING))
      const client = await clientWrapper.getClient()
      if (!client) return
      const histories = (await client.getAllUserActions()).map(history => {
        return {
          message: history.type,
          amount: formatEther(history.amount.toString()),
          unit: getTokenByTokenContractAddress(history.tokenAddress).unit,
          blockNumber: history.blockNumber.toString(),
          counterParty: history.counterParty
        }
      })
      dispatch(setHistoryList(histories))
    } catch (e) {
      console.error(e)
      dispatch(setHistoryListStatus(TRANSACTION_HISTORY_PROGRESS.ERROR))
      dispatch(
        pushToast({
          message: 'Get your transaction history failed.',
          type: 'error'
        })
      )
    }
  }
}
