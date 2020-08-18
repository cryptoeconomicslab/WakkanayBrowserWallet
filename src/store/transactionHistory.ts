import { createAction, createReducer } from '@reduxjs/toolkit'
import { formatEther } from 'ethers/utils'
import clientWrapper from '../client'
import { getTokenByTokenContractAddress } from '../constants/tokens'
import { pushToast } from './toast'

export enum TRANSACTION_HISTORY_ACTION_TYPES {
  SET_HISTORY_LIST = 'SET_HISTORY_LIST',
  SET_HISTORY_LIST_STATUS = 'SET_HISTORY_LIST_STATUS',
  SET_HISTORY_LIST_ERROR = 'SET_HISTORY_LIST_ERROR'
}

export const TRANSACTION_HISTORY_PROGRESS = {
  UNLOADED: 'UNLOADED',
  LOADING: 'LOADING',
  LOADED: 'LOADED',
  ERROR: 'ERROR'
}

export interface State {
  historyList: any[]
  status: string
  error: Error | null
}

const initialState: State = {
  historyList: [],
  status: TRANSACTION_HISTORY_PROGRESS.UNLOADED,
  error: null
}

interface TransactionHistoryAction {
  type: TRANSACTION_HISTORY_ACTION_TYPES
  payload?: any
  error?: boolean
}

export const setHistoryList = createAction<any[]>(
  TRANSACTION_HISTORY_ACTION_TYPES.SET_HISTORY_LIST
)
export const setHistoryListStatus = createAction<string>(
  TRANSACTION_HISTORY_ACTION_TYPES.SET_HISTORY_LIST_STATUS
)
export const setHistoryListError = createAction<Error>(
  TRANSACTION_HISTORY_ACTION_TYPES.SET_HISTORY_LIST_ERROR
)

const reducer = createReducer(initialState, {
  [setHistoryList.type]: (state: State, action: TransactionHistoryAction) => {
    state.historyList = action.payload
    state.status = TRANSACTION_HISTORY_PROGRESS.LOADED
  },
  [setHistoryListStatus.type]: (
    state: State,
    action: TransactionHistoryAction
  ) => {
    state.status = action.payload
  },
  [setHistoryListError.type]: (
    state: State,
    action: TransactionHistoryAction
  ) => {
    state.error = action.payload
    state.status = TRANSACTION_HISTORY_PROGRESS.ERROR
  }
})

export default reducer

export const getTransactionHistories = () => {
  return async (dispatch, getState) => {
    try {
      if (getState().history.status === TRANSACTION_HISTORY_PROGRESS.LOADING) {
        return
      }

      dispatch(setHistoryListStatus(TRANSACTION_HISTORY_PROGRESS.LOADING))
      const client = clientWrapper.getClient()
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
          range: { start: history.range.start, end: history.range.end }
        }
      })
      dispatch(setHistoryList(histories))
    } catch (e) {
      // FIXME: temporary measures
      if (
        e.message ===
        `Failed to execute 'transaction' on 'IDBDatabase': One of the specified object stores was not found.`
      ) {
        dispatch(getTransactionHistories())
        return
      }
      console.error(e)
      dispatch(setHistoryListError(e))
      dispatch(
        pushToast({
          message: 'Get your transaction history failed.',
          type: 'error'
        })
      )
    }
  }
}
