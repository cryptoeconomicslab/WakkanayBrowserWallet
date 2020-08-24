import { createAction, createReducer } from '@reduxjs/toolkit'
import { pushToast } from './toast'
import clientWrapper from '../client'
import { ActionType } from './types'

export enum PENDING_EXIT_LIST_ACTION_TYPES {
  SET_PENDING_EXIT_LIST = 'SET_PENDING_EXIT_LIST',
  SET_PENDING_EXIT_LIST_STATUS = 'SET_PENDING_EXIT_LIST_STATUS',
  SET_PENDING_EXIT_LIST_ERROR = 'SET_PENDING_EXIT_LIST_ERROR'
}

export const PENDING_EXIT_LIST_PROGRESS = {
  UNLOADED: 'UNLOADED',
  LOADING: 'LOADING',
  LOADED: 'LOADED',
  ERROR: 'ERROR'
}

export interface State {
  items: any[]
  status: string
  error: Error | null
}

const initialState: State = {
  items: [],
  status: PENDING_EXIT_LIST_PROGRESS.UNLOADED,
  error: null
}

export const setPendingExitList = createAction<any[]>(
  PENDING_EXIT_LIST_ACTION_TYPES.SET_PENDING_EXIT_LIST
)
export const setPendingExitListStatus = createAction<string>(
  PENDING_EXIT_LIST_ACTION_TYPES.SET_PENDING_EXIT_LIST_STATUS
)
export const setPendingExitListError = createAction<Error>(
  PENDING_EXIT_LIST_ACTION_TYPES.SET_PENDING_EXIT_LIST_ERROR
)

const reducer = createReducer(initialState, {
  [setPendingExitList.type]: (
    state: State,
    action: ActionType<PENDING_EXIT_LIST_ACTION_TYPES>
  ) => {
    state.items = action.payload
    state.status = PENDING_EXIT_LIST_PROGRESS.LOADED
  },
  [setPendingExitListStatus.type]: (
    state: State,
    action: ActionType<PENDING_EXIT_LIST_ACTION_TYPES>
  ) => {
    state.status = action.payload
  },
  [setPendingExitListError.type]: (
    state: State,
    action: ActionType<PENDING_EXIT_LIST_ACTION_TYPES>
  ) => {
    state.error = action.payload
    state.status = PENDING_EXIT_LIST_PROGRESS.ERROR
  }
})

export default reducer

export const getPendingExitList = () => {
  return async (dispatch, getState) => {
    try {
      if (
        getState().pendingExitList.status === PENDING_EXIT_LIST_PROGRESS.LOADING
      ) {
        return
      }

      dispatch(setPendingExitListStatus(PENDING_EXIT_LIST_PROGRESS.LOADING))
      const client = clientWrapper.client
      if (!client) return
      const pendingExitList = await client.getPendingWithdrawals()
      dispatch(setPendingExitList(pendingExitList))
    } catch (e) {
      // FIXME: temporary measures
      if (
        e.message ===
        `Failed to execute 'transaction' on 'IDBDatabase': One of the specified object stores was not found.`
      ) {
        dispatch(getPendingExitList())
        return
      }
      console.error(e)
      dispatch(setPendingExitListError(e))
      dispatch(
        pushToast({ message: 'Get your exit list failed.', type: 'error' })
      )
    }
  }
}
