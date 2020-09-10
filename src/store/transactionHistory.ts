import { createAction, createReducer } from '@reduxjs/toolkit'
import clientWrapper from '../client'
import { transformTransactionHistoryFrom } from '../helper/transactionHistoryHelper'
import { pushToast } from './toast'
import { ActionType, STATE_LOADING_STATUS } from './types'

export enum TRANSACTION_HISTORY_ACTION_TYPES {
  SET_HISTORY_LIST = 'SET_HISTORY_LIST',
  SET_HISTORY_LIST_STATUS = 'SET_HISTORY_LIST_STATUS',
  SET_HISTORY_LIST_ERROR = 'SET_HISTORY_LIST_ERROR'
}

export type TransactionHistory = {
  chunkId: string
  message: string
  amount: string
  unit: string
  blockNumber: string
  counterParty: string
  depositContractAddress: string
  ranges: { start: string; end: string }[]
}

export interface State {
  historyList: TransactionHistory[]
  status: STATE_LOADING_STATUS
  error: Error | null
}

const initialState: State = {
  historyList: [],
  status: STATE_LOADING_STATUS.UNLOADED,
  error: null
}

export const setHistoryList = createAction<TransactionHistory[]>(
  TRANSACTION_HISTORY_ACTION_TYPES.SET_HISTORY_LIST
)
export const setHistoryListStatus = createAction<string>(
  TRANSACTION_HISTORY_ACTION_TYPES.SET_HISTORY_LIST_STATUS
)
export const setHistoryListError = createAction<Error>(
  TRANSACTION_HISTORY_ACTION_TYPES.SET_HISTORY_LIST_ERROR
)

const reducer = createReducer(initialState, {
  [setHistoryList.type]: (
    state: State,
    action: ActionType<TRANSACTION_HISTORY_ACTION_TYPES>
  ) => {
    state.historyList = action.payload
    state.status = STATE_LOADING_STATUS.LOADED
  },
  [setHistoryListStatus.type]: (
    state: State,
    action: ActionType<TRANSACTION_HISTORY_ACTION_TYPES>
  ) => {
    state.status = action.payload
  },
  [setHistoryListError.type]: (
    state: State,
    action: ActionType<TRANSACTION_HISTORY_ACTION_TYPES>
  ) => {
    state.error = action.payload
    state.status = STATE_LOADING_STATUS.ERROR
  }
})

export default reducer

export const getTransactionHistories = () => {
  return async (dispatch, getState) => {
    try {
      if (getState().history.status === STATE_LOADING_STATUS.LOADING) {
        return
      }

      dispatch(setHistoryListStatus(STATE_LOADING_STATUS.LOADING))
      const client = clientWrapper.client
      if (!client) return
      const userActions = await client.getAllUserActions()
      const histories: TransactionHistory[] = []
      for (let i = 0; i < userActions.length; i++) {
        const transactionHistory = transformTransactionHistoryFrom(
          userActions[i]
        )
        if (transactionHistory) histories.push(transactionHistory)
      }
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
