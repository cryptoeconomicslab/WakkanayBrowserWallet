import { createAction, createReducer } from '@reduxjs/toolkit'
import { EthCoder } from '@cryptoeconomicslab/eth-coder'
import { setupContext } from '@cryptoeconomicslab/context'
import clientWrapper from '../client'
import { getAddress } from './address'
import { getPendingExitList } from './pendingExitList'
import { getTransactionHistories } from './transaction_history'
import { getL1Balance, getBalance, getETHtoUSD } from './tokenBalanceList'
import { WALLET_KIND } from '../wallet'

const APP_STATUS = {
  UNLOADED: 'unloaded',
  LOADED: 'loaded',
  INITIAL: 'initial',
  ERROR: 'error'
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
    }
  }
)

const initialGetters = dispatch => {
  dispatch(getL1Balance())
  dispatch(getBalance())
  dispatch(getAddress())
  dispatch(getETHtoUSD()) // get the latest ETH price, returned value's unit is USD/ETH
  dispatch(getTransactionHistories())
  dispatch(getPendingExitList())
}

export const checkClientInitialized = () => {
  return async dispatch => {
    if (!process.browser) {
      dispatch(setAppStatus(APP_STATUS.UNLOADED))
      return
    }

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
      try {
        await clientWrapper.initializeClient({
          kind: loggedInWith
        })
        dispatch(setAppStatus(APP_STATUS.LOADED))
        dispatch(subscribeEvents())
        initialGetters(dispatch)
      } catch (e) {
        console.error(e)
        dispatch(setAppStatus(APP_STATUS.UNLOADED))
      }
    } else {
      dispatch(setAppStatus(APP_STATUS.UNLOADED))
    }
  }
}

export const initializeClient = privateKey => {
  return async dispatch => {
    dispatch(setAppError(null))
    try {
      await clientWrapper.initializeClient({
        kind: WALLET_KIND.WALLET_PRIVATEKEY,
        privateKey
      })
      dispatch(setAppStatus(APP_STATUS.LOADED))
      dispatch(subscribeEvents())
      initialGetters(dispatch)
    } catch (error) {
      console.error(error)
      dispatch(setAppError(error))
      dispatch(setAppStatus(APP_STATUS.ERROR))
    }
  }
}

export const initializeMetamaskWallet = () => {
  return async dispatch => {
    dispatch(setAppError(null))
    try {
      await clientWrapper.initializeClient({
        kind: WALLET_KIND.WALLET_METAMASK
      })
      dispatch(setAppStatus(APP_STATUS.LOADED))
      initialGetters(dispatch)
    } catch (error) {
      console.error(error)
      dispatch(setAppError(error))
    }
  }
}

export const initializeMetamaskSnapWallet = () => {
  return async dispatch => {
    dispatch(setAppError(null))
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
    } catch (error) {
      console.error(error)
      dispatch(setAppError(error))
    }
  }
}

export const initializeWalletConnect = () => {
  return async dispatch => {
    dispatch(setAppError(null))
    try {
      await clientWrapper.initializeClient({
        kind: WALLET_KIND.WALLET_CONNECT
      })
      dispatch(setAppStatus(APP_STATUS.LOADED))
      initialGetters(dispatch)
    } catch (error) {
      console.error(error)
      dispatch(setAppError(error))
    }
  }
}

export const initializeMagicLinkWallet = email => {
  return async dispatch => {
    dispatch(setAppError(null))
    try {
      await clientWrapper.initializeClient({
        kind: WALLET_KIND.WALLET_MAGIC_LINK,
        email
      })
      dispatch(setAppStatus(APP_STATUS.LOADED))
      initialGetters(dispatch)
    } catch (error) {
      console.error(error)
      dispatch(setAppError(error))
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
    dispatch(getBalance())
    dispatch(getL1Balance())
    dispatch(getTransactionHistories())
    dispatch(getPendingExitList())
  })

  client.subscribeSyncFinished(blockNumber => {
    console.info(`sync new state: ${blockNumber.data}`)
    dispatch(getBalance())
    dispatch(getL1Balance())
    dispatch(getTransactionHistories())
    dispatch(getPendingExitList())
  })

  client.subscribeTransferComplete(stateUpdate => {
    console.info(
      `%c transfer complete for range: %c (${stateUpdate.range.start.data}, ${stateUpdate.range.end.data})`,
      'color: brown; font-weight: bold;',
      'font-weight: bold;'
    )
    dispatch(getBalance())
    dispatch(getL1Balance())
    dispatch(getTransactionHistories())
    dispatch(getPendingExitList())
  })

  client.subscribeExitFinalized(async exitId => {
    console.info(`exit finalized for exit: ${exitId.toHexString()}`)
    dispatch(getBalance())
    dispatch(getL1Balance())
    dispatch(getTransactionHistories())
    dispatch(getPendingExitList())
  })
}
