import { createAction, createReducer } from '@reduxjs/toolkit'
import { EthCoder } from '@cryptoeconomicslab/eth-coder'
import { setupContext } from '@cryptoeconomicslab/context'
import clientWrapper from '../client'
import { getAddress } from './address'
import { getEthUsdRate } from './ethUsdRate'
import { getPendingExitList } from './pendingExitList'
import { pushToast } from './toast'
import { getL1Balance } from './l1Balance'
import { getL2Balance } from './l2Balance'
import { getTransactionHistories } from './transactionHistory'
import { WALLET_KIND } from '../wallet'
import { sleep } from '../utils'

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

export const setAppStatus = createAction('SET_APP_STATUS')
export const setSyncingStatus = createAction('SET_SYNCING_STATUS')
export const setAppError = createAction('SET_APP_ERROR')

export const appStatusReducer = createReducer(
  {
    status: APP_STATUS.UNLOADED,
    error: null,
    syncingStatus: SYNCING_STATUS.UNLOADED,
    syncingBlockNumber: 0
  },
  {
    [setAppStatus]: (state, action) => {
      state.status = action.payload
    },
    [setAppError]: (state, action) => {
      state.error = action.payload
      state.status = APP_STATUS.ERROR
    },
    [setSyncingStatus]: (state, action) => {
      state.syncingStatus = action.payload
    }
  }
)

export const initialGetters = (dispatch, getState) => {
  if (getState().appStatus.syncingStatus === SYNCING_STATUS.LOADED) {
    dispatch(getEthUsdRate())
    dispatch(getAddress())
    dispatch(getL1Balance())
    dispatch(getL2Balance())
    dispatch(getTransactionHistories())
    dispatch(getPendingExitList())
  }
}
const subscribedEventGetters = (dispatch, getState) => {
  if (getState().appStatus.syncingStatus === SYNCING_STATUS.LOADED) {
    dispatch(getL1Balance())
    dispatch(getL2Balance())
    dispatch(getTransactionHistories())
    dispatch(getPendingExitList())
  }
}
const initializeClientWrapper = async (dispatch, getState, kind, email) => {
  await clientWrapper.initializeClient({
    kind,
    email
  })
  dispatch(subscribeEvents())
  clientWrapper.start().then(() => {
    dispatch(setSyncingStatus(SYNCING_STATUS.LOADED))
    initialGetters(dispatch, getState)
  })
  initialGetters(dispatch, getState)
}

export const checkClientInitialized = () => {
  return async (dispatch, getState) => {
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
        initialGetters(dispatch, getState)
        dispatch(setAppStatus(APP_STATUS.LOADED))
        return
      }

      const loggedInWith = localStorage.getItem('loggedInWith')
      if (loggedInWith) {
        initializeClientWrapper(dispatch, getState, loggedInWith)
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
  return async (dispatch, getState) => {
    try {
      dispatch(setAppStatus(APP_STATUS.LOADING))
      initializeClientWrapper(dispatch, getState, WALLET_KIND.WALLET_METAMASK)
      dispatch(setAppStatus(APP_STATUS.LOADED))
    } catch (e) {
      console.error(e)
      dispatch(pushToast({ message: e.message, type: 'error' }))
      dispatch(setAppError(e))
    }
  }
}

export const initializeMetamaskSnapWallet = () => {
  return async (dispatch, getState) => {
    try {
      dispatch(setAppStatus(APP_STATUS.LOADING))
      // identify the Snap by the location of its package.json file
      const snapId = new URL('package.json', window.location.href).toString()
      initializeClientWrapper(
        dispatch,
        getState,
        WALLET_KIND.WALLET_METAMASK_SNAP
      )

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
  return async (dispatch, getState) => {
    try {
      dispatch(setAppStatus(APP_STATUS.LOADING))
      initializeClientWrapper(dispatch, getState, WALLET_KIND.WALLET_CONNECT)
      dispatch(setAppStatus(APP_STATUS.LOADED))
    } catch (e) {
      console.error(e)
      dispatch(pushToast({ message: e.message, type: 'error' }))
      dispatch(setAppError(e))
    }
  }
}

export const initializeMagicLinkWallet = email => {
  return async (dispatch, getState) => {
    try {
      dispatch(setAppStatus(APP_STATUS.LOADING))
      initializeClientWrapper(
        dispatch,
        getState,
        WALLET_KIND.WALLET_CONNECT,
        email
      )
      dispatch(setAppStatus(APP_STATUS.LOADED))
    } catch (e) {
      console.error(e)
      dispatch(pushToast({ message: e.message, type: 'error' }))
      dispatch(setAppError(e))
    }
  }
}

const subscribeCheckpointFinalizedEvent = client => {
  return (dispatch, getState) => {
    client.subscribeCheckpointFinalized(async (checkpointId, checkpoint) => {
      console.info(
        `new %ccheckpoint %cdetected: %c{ id: ${checkpointId.toHexString()}, checkpoint: (${checkpoint}) }`,
        'color: pink; font-weight: bold;',
        '',
        'font-weight: bold;'
      )
      await sleep(500)
      subscribedEventGetters(dispatch, getState)
    })
  }
}

const subscribeSyncStartedEvent = client => {
  return dispatch => {
    client.subscribeSyncBlockStarted(blockNumber => {
      console.info(`syncing... ${blockNumber.data}`)
      dispatch(setSyncingStatus(SYNCING_STATUS.LOADING))
    })

    client.subscribeSyncBlocksStarted(({ from, to }) => {
      console.info(`syncing... from ${from.data} to ${to.data}`)
      dispatch(setSyncingStatus(SYNCING_STATUS.LOADING))
    })
  }
}

const subscribeSyncFinishedEvent = client => {
  return (dispatch, getState) => {
    client.subscribeSyncBlockFinished(async blockNumber => {
      console.info(`sync new state: ${blockNumber.data}`)
      dispatch(setSyncingStatus(SYNCING_STATUS.LOADED))
      subscribedEventGetters(dispatch, getState)
    })

    client.subscribeSyncBlocksFinished(({ from, to }) => {
      console.info(`sync new state: from ${from.data} to ${to.data}`)
      dispatch(setSyncingStatus(SYNCING_STATUS.LOADED))
      subscribedEventGetters(dispatch, getState)
    })
  }
}

const subscribeTransferCompleteEvent = client => {
  return (dispatch, getState) => {
    client.subscribeTransferComplete(stateUpdate => {
      console.info(
        `%c transfer complete for range: %c (${stateUpdate.range.start.data}, ${stateUpdate.range.end.data})`,
        'color: brown; font-weight: bold;',
        'font-weight: bold;'
      )
      subscribedEventGetters(dispatch, getState)
    })
  }
}

const subscribeExitFinalizedEvent = client => {
  return (dispatch, getState) => {
    client.subscribeExitFinalized(async stateUpdate => {
      console.info(`completed withdrawal: ${stateUpdate}`)
      subscribedEventGetters(dispatch, getState)
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
