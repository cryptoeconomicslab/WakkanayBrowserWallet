import { createAction, createReducer } from '@reduxjs/toolkit'
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
      console.error(e)
      dispatch(setPendingExitListError(e))
      // TODO: add toast after merge #154
      // dispatch(
      //   pushToast({ message: 'Get your exit list failed.', type: 'error' })
      // )
    }
  }
}
