import { createAction, createReducer } from '@reduxjs/toolkit'
import { EthCoder } from '@cryptoeconomicslab/eth-coder'
import { setupContext } from '@cryptoeconomicslab/context'
import clientWrapper from '../client'
import { config } from '../config'
import { CommitmentContract } from '../contracts'
import { getAddress } from './address'
import { pushToast } from './toast'
import { getEthUsdRate } from './ethUsdRate'
import { getL1Balance } from './l1Balance'
import { getL2Balance } from './l2Balance'
import { setCurrentBlockNumber } from './plasmaBlockNumber'
import { getTransactionHistories } from './transactionHistory'
import { autoCompleteWithdrawal } from './withdraw'
import { WALLET_KIND } from '../wallet'

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
export const setSyncingBlockNumber = createAction('SET_SYNCING_BLOCK_NUMBER')

export const appStatusReducer = createReducer(
  {
    status: APP_STATUS.UNLOADED,
    syncingStatus: SYNCING_STATUS.LOADED,
    syncingBlockNumber: 0
  },
  {
    [setAppStatus]: (state, action) => {
      state.status = action.payload
    },
    [setSyncingStatus]: (state, action) => {
      state.syncingStatus = action.payload
    },
    [setSyncingBlockNumber]: (state, action) => {
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
        initialGetters(dispatch)
        dispatch(setAppStatus(APP_STATUS.LOADED))
      } else {
        dispatch(setAppStatus(APP_STATUS.UNLOADED))
      }
    } catch (e) {
      console.error(e)
      dispatch(pushToast({ message: e.message, type: 'error' }))
      dispatch(setAppStatus(APP_STATUS.ERROR))
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
      initialGetters(dispatch)
      dispatch(setAppStatus(APP_STATUS.LOADED))
      dispatch(subscribeEvents())
    } catch (e) {
      console.error(e)
      dispatch(pushToast({ message: e.message, type: 'error' }))
      dispatch(setAppStatus(APP_STATUS.ERROR))
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
      initialGetters(dispatch)
      dispatch(setAppStatus(APP_STATUS.LOADED))
    } catch (e) {
      console.error(e)
      dispatch(pushToast({ message: e.message, type: 'error' }))
      dispatch(setAppStatus(APP_STATUS.ERROR))
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
      dispatch(setAppStatus(APP_STATUS.ERROR))
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
      initialGetters(dispatch)
      dispatch(setAppStatus(APP_STATUS.LOADED))
    } catch (e) {
      console.error(e)
      dispatch(pushToast({ message: e.message, type: 'error' }))
      dispatch(setAppStatus(APP_STATUS.ERROR))
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
      initialGetters(dispatch)
      dispatch(setAppStatus(APP_STATUS.LOADED))
    } catch (e) {
      console.error(e)
      dispatch(pushToast({ message: e.message, type: 'error' }))
      dispatch(setAppStatus(APP_STATUS.ERROR))
    }
  }
}

export const subscribeCheckpointFinalizedEvent = async dispatch => {
  const client = clientWrapper.getClient()
  if (!client) {
    throw new Error('client is not initialized yet.')
  }
  client.subscribeCheckpointFinalized((checkpointId, checkpoint) => {
    console.info(
      `new %ccheckpoint %cdetected: %c{ id: ${checkpointId.toHexString()}, checkpoint: (${checkpoint}) }`,
      'color: pink; font-weight: bold;',
      '',
      'font-weight: bold;'
    )
    dispatch(getL1Balance())
    dispatch(getL2Balance())
    dispatch(getTransactionHistories())
  })
}

export const subscribeSyncStartedEvent = async (dispatch, client) => {
  client.subscribeSyncStarted(async blockNumber => {
    console.info(`syncing... ${blockNumber.data}`)
    dispatch(setSyncingStatus(SYNCING_STATUS.LOADING))
  })
}

export const subscribeSyncFinishedEvent = async (dispatch, client) => {
  client.subscribeSyncFinished(async blockNumber => {
    console.info(`sync new state: ${blockNumber.data}`)
    const contract = new CommitmentContract(
      config.CommitmentContract,
      client.wallet.provider.getSigner()
    )
    // TODO: it has a problem of performance
    const currentBlockNumber = await contract.getCurrentBlock()
    dispatch(setCurrentBlockNumber(currentBlockNumber))
    dispatch(setSyncingBlockNumber(blockNumber.raw))
    dispatch(getL1Balance())
    dispatch(getL2Balance())
    dispatch(getTransactionHistories())
    if (currentBlockNumber === blockNumber.raw) {
      dispatch(setSyncingStatus(SYNCING_STATUS.LOADED))
    }
  })
}

export const subscribeTransferCompleteEvent = async (dispatch, client) => {
  client.subscribeTransferComplete(stateUpdate => {
    console.info(
      `%c transfer complete for range: %c (${stateUpdate.range.start.data}, ${stateUpdate.range.end.data})`,
      'color: brown; font-weight: bold;',
      'font-weight: bold;'
    )
    dispatch(getL1Balance())
    dispatch(getL2Balance())
    dispatch(getTransactionHistories())
  })
}

export const subscribeExitFinalizedEvent = async (dispatch, client) => {
  client.subscribeExitFinalized(async exitId => {
    console.info(`exit finalized for exit: ${exitId.toHexString()}`)
    dispatch(getL1Balance())
    dispatch(getL2Balance())
    dispatch(getTransactionHistories())
  })
}

export const subscribeEvents = () => async dispatch => {
  try {
    const client = clientWrapper.getClient()
    if (!client) {
      throw new Error('client is not initialized yet.')
    }
    subscribeCheckpointFinalizedEvent(dispatch, client)
    subscribeSyncStartedEvent(dispatch, client)
    subscribeSyncFinishedEvent(dispatch, client)
    subscribeTransferCompleteEvent(dispatch, client)
    subscribeExitFinalizedEvent(dispatch, client)
    autoCompleteWithdrawal(dispatch, client)
  } catch (e) {
    console.error(e)
    dispatch(pushToast({ message: e.message, type: 'error' }))
  }
}
