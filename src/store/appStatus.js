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

export const APP_STATUS = {
  UNLOADED: 'UNLOADED',
  LOADED: 'LOADED',
  INITIAL: 'INITIAL',
  ERROR: 'ERROR'
}

export const setAppStatus = createAction('SET_APP_STATUS')
export const setAppError = createAction('SET_APP_ERROR')

export const appStatusReducer = createReducer(
  { status: APP_STATUS.INITIAL, error: null },
  {
    [setAppStatus]: (state, action) => {
      state.status = action.payload
    },
    [setAppError]: (state, action) => {
      state.error = action.payload
      state.status = APP_STATUS.ERROR
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
}

export const checkClientInitialized = () => {
  return async dispatch => {
    if (!process.browser) {
      dispatch(setAppStatus(APP_STATUS.UNLOADED))
      return
    }

    try {
      setupContext({ coder: EthCoder })
      const client = clientWrapper.getClient()
      if (client) {
        dispatch(setAppStatus(APP_STATUS.LOADED))
        dispatch(subscribeEvents())
        initialGetters(dispatch)
        return
      }

      const loggedInWith = localStorage.getItem('loggedInWith')
      if (loggedInWith) {
        await clientWrapper.initializeClient({
          kind: loggedInWith
        })
        dispatch(setAppStatus(APP_STATUS.LOADED))
        dispatch(subscribeEvents())
        initialGetters(dispatch)
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
      dispatch(setAppError(e))
    }
  }
}

export const initializeMetamaskWallet = () => {
  return async dispatch => {
    try {
      await clientWrapper.initializeClient({
        kind: WALLET_KIND.WALLET_METAMASK
      })
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
      dispatch(setAppError(e))
    }
  }
}

export const initializeWalletConnect = () => {
  return async dispatch => {
    try {
      await clientWrapper.initializeClient({
        kind: WALLET_KIND.WALLET_CONNECT
      })
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
      await clientWrapper.initializeClient({
        kind: WALLET_KIND.WALLET_MAGIC_LINK,
        email
      })
      initialGetters(dispatch)
      dispatch(setAppStatus(APP_STATUS.LOADED))
    } catch (e) {
      console.error(e)
      dispatch(pushToast({ message: e.message, type: 'error' }))
      dispatch(setAppError(e))
    }
  }
}

export const subscribeEvents = () => async dispatch => {
  console.log('🔥Subscribe light client events')
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
    dispatch(getPendingExitList())
  })

  client.subscribeSyncFinished(blockNumber => {
    console.info(`sync new state: ${blockNumber.data}`)
    dispatch(getL1Balance())
    dispatch(getL2Balance())
    dispatch(getTransactionHistories())
    dispatch(getPendingExitList())
  })

  client.subscribeTransferComplete(stateUpdate => {
    console.info(
      `%c transfer complete for range: %c (${stateUpdate.range.start.data}, ${stateUpdate.range.end.data})`,
      'color: brown; font-weight: bold;',
      'font-weight: bold;'
    )
    dispatch(getL1Balance())
    dispatch(getL2Balance())
    dispatch(getTransactionHistories())
    dispatch(getPendingExitList())
  })

  client.subscribeExitFinalized(async exitId => {
    console.info(`exit finalized for exit: ${exitId.toHexString()}`)
    dispatch(getL1Balance())
    dispatch(getL2Balance())
    dispatch(getTransactionHistories())
    dispatch(getPendingExitList())
  })
}
