import { Dispatch } from 'redux'
import { createAction, createReducer } from '@reduxjs/toolkit'
import { EthCoder } from '@cryptoeconomicslab/eth-coder'
import { setupContext } from '@cryptoeconomicslab/context'
import LightClient from '@cryptoeconomicslab/plasma-light-client'
import clientWrapper from '../client'
import { config } from '../config'
import { CommitmentContract } from '../contracts'
import { WALLET_KIND } from '../wallet'
import { getAddress } from './address'
import { getEthUsdRate } from './ethUsdRate'
import { getPendingExitList } from './pendingExitList'
import { pushToast } from './toast'
import { getL1Balance } from './l1Balance'
import { getL2Balance } from './l2Balance'
import {
  getCurrentBlockNumber,
  setCurrentBlockNumber
} from './plasmaBlockNumber'
import { getTransactionHistories } from './transactionHistory'

export enum APP_STATUS_ACTION_TYPES {
  SET_APP_STATUS = 'SET_APP_STATUS',
  SET_APP_ERROR = 'SET_APP_ERROR'
}

export enum SYNCING_STATUS_ACTION_TYPES {
  SET_SYNCING_STATUS = 'SET_SYNCING_STATUS',
  SET_SYNCING_BLOCK_NUMBER = 'SET_SYNCING_BLOCK_NUMBER'
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
  syncingBlockNumber: number
}

const initialState: State = {
  status: APP_STATUS.UNLOADED,
  error: null,
  syncingStatus: SYNCING_STATUS.LOADED,
  syncingBlockNumber: 0
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
export const setSyncingBlockNumber = createAction<number>(
  SYNCING_STATUS_ACTION_TYPES.SET_SYNCING_BLOCK_NUMBER
)

export const appStatusReducer = createReducer(initialState, {
  [setAppStatus.type]: (state: State, action: AppStatusAction) => {
    state.status = action.payload
  },
  [setAppError.type]: (state: State, action: AppStatusAction) => {
    state.error = action.payload
    state.status = APP_STATUS.ERROR
  },
  [setSyncingStatus.type]: (state: State, action: SyncingStatusAction) => {
    state.syncingStatus = action.payload
  },
  [setSyncingBlockNumber.type]: (state: State, action: SyncingStatusAction) => {
    state.syncingBlockNumber = action.payload
  }
})

const initialGetters = (dispatch: Dispatch) => {
  dispatch(getL1Balance())
  dispatch(getL2Balance())
  dispatch(getAddress())
  dispatch(getEthUsdRate()) // get the latest ETH price, returned value's unit is USD/ETH
  dispatch(getTransactionHistories())
  dispatch(getPendingExitList())
  dispatch(getCurrentBlockNumber())
}
const subscribedEventGetters = (dispatch: Dispatch) => {
  dispatch(getL1Balance())
  dispatch(getL2Balance())
  dispatch(getTransactionHistories())
  dispatch(getPendingExitList())
}

export const checkClientInitialized = () => {
  return async (dispatch: Dispatch) => {
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
  return async (dispatch: Dispatch) => {
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

export const initializeMetamaskSnapWallet = () => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(setAppStatus(APP_STATUS.LOADING))
      // identify the Snap by the location of its package.json file
      const snapId = new URL('package.json', window.location.href).toString()
      await clientWrapper.initializeClient({
        kind: WALLET_KIND.WALLET_METAMASK_SNAP
      })
      dispatch(subscribeEvents())
      clientWrapper.start()
      initialGetters(dispatch)

      // get permissions to interact with and install the plugin
      await window.ethereum.send({
        method: 'wallet_enable',
        params: [
          {
            wallet_plugin: { [snapId]: {} }
          }
        ]
      })
      dispatch(setAppStatus(APP_STATUS.LOADED))
    } catch (e) {
      console.error(e)
      dispatch(pushToast({ message: e.message, type: 'error' }))
      dispatch(setAppError(e))
    }
  }
}

export const initializeWalletConnect = () => {
  return async (dispatch: Dispatch) => {
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

export const initializeMagicLinkWallet = email => {
  return async (dispatch: Dispatch) => {
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

const subscribeCheckpointFinalizedEvent = client => {
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

const subscribeSyncStartedEvent = client => {
  return async (dispatch: Dispatch) => {
    client.subscribeSyncStarted(blockNumber => {
      console.info(`syncing... ${blockNumber.data}`)
      dispatch(setSyncingStatus(SYNCING_STATUS.LOADING))
    })
  }
}

const subscribeSyncFinishedEvent = client => {
  return async (dispatch: Dispatch) => {
    // TODO: it has a problem of performance
    const commitmentContract = new CommitmentContract(
      config.commitment,
      client.wallet.provider.getSigner()
    )
    client.subscribeSyncFinished(async blockNumber => {
      console.info(`sync new state: ${blockNumber.data}`)
      const currentBlockNumber = Number(
        await commitmentContract.getCurrentBlockNumber()
      )
      dispatch(setCurrentBlockNumber(currentBlockNumber))
      dispatch(setSyncingBlockNumber(blockNumber.raw))
      if (currentBlockNumber === blockNumber.raw) {
        subscribedEventGetters(dispatch)
        dispatch(setSyncingStatus(SYNCING_STATUS.LOADED))
      }
    })
  }
}

const subscribeTransferCompleteEvent = (client: LightClient) => {
  return async (dispatch: Dispatch) => {
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
  return async (dispatch: Dispatch) => {
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
  return async (dispatch: Dispatch) => {
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
