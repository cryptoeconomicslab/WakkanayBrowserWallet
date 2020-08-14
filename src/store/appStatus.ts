import { createAction, createReducer } from '@reduxjs/toolkit'
import { EthCoder } from '@cryptoeconomicslab/eth-coder'
import { setupContext } from '@cryptoeconomicslab/context'
import clientWrapper from '../client'
import { config } from '../config'
import { CommitmentContract } from '../contracts'
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
import { WALLET_KIND } from '../wallet'

export enum APP_STATUS_ACTION_TYPES {
  SET_APP_STATUS = 'SET_APP_STATUS',
  SET_APP_ERROR = 'SET_APP_ERROR'
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

export const setAppStatus = createAction<string>('SET_APP_STATUS')
export const setSyncingStatus = createAction<string>('SET_SYNCING_STATUS')
export const setSyncingBlockNumber = createAction<number>(
  'SET_SYNCING_BLOCK_NUMBER'
)
export const setAppError = createAction<Error>('SET_APP_ERROR')

export const appStatusReducer = createReducer(
  {
    status: APP_STATUS.UNLOADED,
    error: null,
    syncingStatus: SYNCING_STATUS.LOADED,
    syncingBlockNumber: 0
  },
  {
    [setAppStatus.type]: (state, action) => {
      state.status = action.payload
    },
    [setAppError.type]: (state, action) => {
      state.error = action.payload
      state.status = APP_STATUS.ERROR
    },
    [setSyncingStatus.type]: (state, action) => {
      state.syncingStatus = action.payload
    },
    [setSyncingBlockNumber.type]: (state, action) => {
      state.syncingBlockNumber = action.payload
    }
  }
)

const initialGetters = dispatch => {
  dispatch(getL1Balance())
  dispatch(getL2Balance())
  dispatch(getAddress())
  dispatch(getEthUsdRate()) // get the latest ETH price, returned value's unit is USD/ETH
  dispatch(getTransactionHistories())
  dispatch(getPendingExitList())
  dispatch(getCurrentBlockNumber())
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
          kind: loggedInWith
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

export const initializeClient = privateKey => {
  return async dispatch => {
    try {
      dispatch(setAppStatus(APP_STATUS.LOADING))
      await clientWrapper.initializeClient({
        kind: WALLET_KIND.WALLET_PRIVATEKEY,
        privateKey
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

export const initializeMetamaskSnapWallet = () => {
  return async dispatch => {
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

export const initializeMagicLinkWallet = email => {
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

const subscribeCheckpointFinalizedEvent = client => {
  return dispatch => {
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
  return dispatch => {
    client.subscribeSyncStarted(blockNumber => {
      console.info(`syncing... ${blockNumber.data}`)
      dispatch(setSyncingStatus(SYNCING_STATUS.LOADING))
    })
  }
}

const subscribeSyncFinishedEvent = client => {
  return async dispatch => {
    // TODO: it has a problem of performance
    const commitmentContract = new CommitmentContract(
      config.commitment,
      client.wallet.provider.getSigner()
    )
    client.subscribeSyncFinished(async blockNumber => {
      console.info(`sync new state: ${blockNumber.data}`)
      const currentBlockNumber = await commitmentContract.getCurrentBlockNumber()
      dispatch(setCurrentBlockNumber(currentBlockNumber))
      dispatch(setSyncingBlockNumber(blockNumber.raw))
      if (currentBlockNumber === blockNumber.raw) {
        subscribedEventGetters(dispatch)
        dispatch(setSyncingStatus(SYNCING_STATUS.LOADED))
      }
    })
  }
}

const subscribeTransferCompleteEvent = client => {
  return dispatch => {
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

const subscribeExitFinalizedEvent = client => {
  return dispatch => {
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
