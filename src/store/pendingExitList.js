import { createAction, createReducer } from '@reduxjs/toolkit'
import { pushToast } from './toast'
import clientWrapper from '../client'

export const EXIT_LIST_PROGRESS = {
  UNLOADED: 'UNLOADED',
  LOADING: 'LOADING',
  LOADED: 'LOADED',
  ERROR: 'ERROR'
}

export const setPendingExitList = createAction('SET_PENDING_EXIT_LIST')
export const setPendingExitListStatus = createAction(
  'SET_PENDING_EXIT_LIST_STATUS'
)
export const setPendingExitListError = createAction(
  'SET_PENDING_EXIT_LIST_ERROR'
)

export const pendingExitListReducer = createReducer(
  {
    items: [],
    status: EXIT_LIST_PROGRESS.UNLOADED,
    error: null
  },
  {
    [setPendingExitList]: (state, action) => {
      state.items = action.payload
      state.status = EXIT_LIST_PROGRESS.LOADED
    },
    [setPendingExitListStatus]: (state, action) => {
      state.status = action.payload
    },
    [setPendingExitListError]: (state, action) => {
      state.error = action.payload
      state.status = EXIT_LIST_PROGRESS.ERROR
    }
  }
)

export const getPendingExitList = () => {
  return async dispatch => {
    try {
      dispatch(setPendingExitListStatus(EXIT_LIST_PROGRESS.LOADING))
      const client = await clientWrapper.getClient()
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
