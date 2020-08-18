import { Dispatch } from 'redux'
import { createAction, createReducer } from '@reduxjs/toolkit'
import { EthCoder } from '@cryptoeconomicslab/eth-coder'
import { setupContext } from '@cryptoeconomicslab/context'
import LightClient from '@cryptoeconomicslab/plasma-light-client'
import { BigNumber } from '@cryptoeconomicslab/primitives'
import clientWrapper from '../client'
import { WALLET_KIND } from '../wallet'
import { getAddress } from './address'
import { getEthUsdRate } from './ethUsdRate'
import { getPendingExitList } from './pendingExitList'
import { pushToast } from './toast'
import { getL1Balance } from './l1Balance'
import { getL2Balance } from './l2Balance'
import { getTransactionHistories } from './transactionHistory'

export enum APP_STATUS_ACTION_TYPES {
  SET_APP_STATUS = 'SET_APP_STATUS',
  SET_APP_ERROR = 'SET_APP_ERROR'
}

export enum SYNCING_STATUS_ACTION_TYPES {
  SET_SYNCING_STATUS = 'SET_SYNCING_STATUS'
}

export const APP_STATUS = {
  UNLOADED: 'UNLOADED',
  LOADING: 'LOADING',
  LOADED: 'LOADED',
  ERROR: 'ERROR'
}

export const SYNCING_STATUS = {
  UNLOADED: 'UNLOADED',
  LOADING: 'LOADING',
  LOADED: 'LOADED',
  ERROR: 'ERROR'
}

export interface State {
  status: string
  error: Error | null
  syncingStatus: string
}

const initialState: State = {
  status: APP_STATUS.UNLOADED,
  error: null,
  syncingStatus: SYNCING_STATUS.LOADED
}

interface AppStatusAction {
  type: APP_STATUS_ACTION_TYPES
  payload?: any
  error?: boolean
}

interface SyncingStatusAction {
  type: SYNCING_STATUS_ACTION_TYPES
  payload?: any
  error?: boolean
}

export const setAppStatus = createAction<string>(
  APP_STATUS_ACTION_TYPES.SET_APP_STATUS
)
export const setAppError = createAction<Error>(
  APP_STATUS_ACTION_TYPES.SET_APP_ERROR
)
export const setSyncingStatus = createAction<string>(
  SYNCING_STATUS_ACTION_TYPES.SET_SYNCING_STATUS
)

const reducer = createReducer(initialState, {
  [setAppStatus.type]: (state: State, action: AppStatusAction) => {
    state.status = action.payload
  },
  [setAppError.type]: (state: State, action: AppStatusAction) => {
    state.error = action.payload
    state.status = APP_STATUS.ERROR
  },
  [setSyncingStatus.type]: (state: State, action: SyncingStatusAction) => {
    state.syncingStatus = action.payload
  }
})

export default reducer

const initialGetters = dispatch => {
  dispatch(getL1Balance())
  dispatch(getL2Balance())
  dispatch(getAddress())
  dispatch(getEthUsdRate()) // get the latest ETH price, returned value's unit is USD/ETH
  dispatch(getTransactionHistories())
  dispatch(getPendingExitList())
}
const subscribedEventGetters = dispatch => {
  dispatch(getL1Balance())
  dispatch(getL2Balance())
  dispatch(getTransactionHistories())
  dispatch(getPendingExitList())
}

export const checkClientInitialized = () => {
  return async dispatch => {
    if (!process.browser) {
      dispatch(setAppStatus(APP_STATUS.UNLOADED))
      return
    }

    try {
      dispatch(setAppStatus(APP_STATUS.LOADING))
      setupContext({ coder: EthCoder })
      const client = clientWrapper.getClient()
      if (client) {
        dispatch(subscribeEvents())
        initialGetters(dispatch)
        dispatch(setAppStatus(APP_STATUS.LOADED))
        return
      }

      const loggedInWith = localStorage.getItem('loggedInWith')
      if (loggedInWith) {
        await clientWrapper.initializeClient({
          kind: loggedInWith as WALLET_KIND
        })
        dispatch(subscribeEvents())
        clientWrapper.start()
        initialGetters(dispatch)
        dispatch(setAppStatus(APP_STATUS.LOADED))
      } else {
        dispatch(setAppStatus(APP_STATUS.UNLOADED))
      }
    } catch (e) {
      console.error(e)
      dispatch(pushToast({ message: e.message, type: 'error' }))
      dispatch(setAppError(e))
    }
  }
}

export const initializeMetamaskWallet = () => {
  return async dispatch => {
    try {
      dispatch(setAppStatus(APP_STATUS.LOADING))
      await clientWrapper.initializeClient({
        kind: WALLET_KIND.WALLET_METAMASK
      })
      dispatch(subscribeEvents())
      clientWrapper.start()
      initialGetters(dispatch)
      dispatch(setAppStatus(APP_STATUS.LOADED))
    } catch (e) {
      console.error(e)
      dispatch(pushToast({ message: e.message, type: 'error' }))
      dispatch(setAppError(e))
    }
  }
}

export const initializeWalletConnect = () => {
  return async dispatch => {
    try {
      dispatch(setAppStatus(APP_STATUS.LOADING))
      await clientWrapper.initializeClient({
        kind: WALLET_KIND.WALLET_CONNECT
      })
      dispatch(subscribeEvents())
      clientWrapper.start()
      initialGetters(dispatch)
      dispatch(setAppStatus(APP_STATUS.LOADED))
    } catch (e) {
      console.error(e)
      dispatch(pushToast({ message: e.message, type: 'error' }))
      dispatch(setAppError(e))
    }
  }
}

export const initializeMagicLinkWallet = (email: string) => {
  return async dispatch => {
    try {
      dispatch(setAppStatus(APP_STATUS.LOADING))
      await clientWrapper.initializeClient({
        kind: WALLET_KIND.WALLET_MAGIC_LINK,
        email
      })
      dispatch(subscribeEvents())
      clientWrapper.start()
      initialGetters(dispatch)
      dispatch(setAppStatus(APP_STATUS.LOADED))
    } catch (e) {
      console.error(e)
      dispatch(pushToast({ message: e.message, type: 'error' }))
      dispatch(setAppError(e))
    }
  }
}

const subscribeCheckpointFinalizedEvent = (client: LightClient) => {
  return async (dispatch: Dispatch) => {
    client.subscribeCheckpointFinalized((checkpointId, checkpoint) => {
      console.info(
        `new %ccheckpoint %cdetected: %c{ id: ${checkpointId.toHexString()}, checkpoint: (${checkpoint}) }`,
        'color: pink; font-weight: bold;',
        '',
        'font-weight: bold;'
      )
      subscribedEventGetters(dispatch)
    })
  }
}

const subscribeSyncStartedEvent = (client: LightClient) => {
  return (dispatch: Dispatch) => {
    client.subscribeSyncStarted((blockNumber: BigNumber) => {
      console.info(`syncing... ${blockNumber.data}`)
      dispatch(setSyncingStatus(SYNCING_STATUS.LOADING))
    })
  }
}

const subscribeSyncFinishedEvent = (client: LightClient) => {
  return (dispatch: Dispatch) => {
    client.subscribeSyncFinished((blockNumber: BigNumber) => {
      console.info(`sync new state: ${blockNumber.data}`)
      subscribedEventGetters(dispatch)
      dispatch(setSyncingStatus(SYNCING_STATUS.LOADED))
    })
  }
}

const subscribeTransferCompleteEvent = (client: LightClient) => {
  return (dispatch: Dispatch) => {
    client.subscribeTransferComplete(stateUpdate => {
      console.info(
        `%c transfer complete for range: %c (${stateUpdate.range.start.data}, ${stateUpdate.range.end.data})`,
        'color: brown; font-weight: bold;',
        'font-weight: bold;'
      )
      subscribedEventGetters(dispatch)
    })
  }
}

const subscribeExitFinalizedEvent = (client: LightClient) => {
  return (dispatch: Dispatch) => {
    client.subscribeExitFinalized(async stateUpdate => {
      console.info(`completed withdrawal: ${stateUpdate}`)
      subscribedEventGetters(dispatch)
      dispatch(
        pushToast({ message: 'Complete withdrawal success.', type: 'info' })
      )
    })
  }
}

export const subscribeEvents = () => {
  return dispatch => {
    try {
      console.log('start subscribing events')
      const client = clientWrapper.getClient()
      if (!client) {
        throw new Error('client is not initialized yet.')
      }
      dispatch(subscribeSyncStartedEvent(client))
      dispatch(subscribeSyncFinishedEvent(client))
      dispatch(subscribeCheckpointFinalizedEvent(client))
      dispatch(subscribeTransferCompleteEvent(client))
      dispatch(subscribeExitFinalizedEvent(client))
    } catch (e) {
      console.error(e)
      dispatch(pushToast({ message: e.message, type: 'error' }))
    }
  }
}
