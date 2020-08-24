import { Dispatch } from 'redux'
import { createAction, createReducer } from '@reduxjs/toolkit'
import { EthCoder } from '@cryptoeconomicslab/eth-coder'
import { setupContext } from '@cryptoeconomicslab/context'
import { Exit, StateUpdate } from '@cryptoeconomicslab/plasma'
import LightClient, {
  UserAction
} from '@cryptoeconomicslab/plasma-light-client'
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
import { ActionType } from './types'

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
  [setAppStatus.type]: (
    state: State,
    action: ActionType<APP_STATUS_ACTION_TYPES>
  ) => {
    state.status = action.payload
  },
  [setAppError.type]: (
    state: State,
    action: ActionType<APP_STATUS_ACTION_TYPES>
  ) => {
    state.error = action.payload
    state.status = APP_STATUS.ERROR
  },
  [setSyncingStatus.type]: (
    state: State,
    action: ActionType<SYNCING_STATUS_ACTION_TYPES>
  ) => {
    state.syncingStatus = action.payload
  }
})

export default reducer

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
const initializeClientWrapper = async (
  dispatch,
  getState,
  kind: WALLET_KIND,
  email?: string
) => {
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
      const client = clientWrapper.client
      if (client) {
        dispatch(subscribeEvents())
        initialGetters(dispatch, getState)
        dispatch(setAppStatus(APP_STATUS.LOADED))
        return
      }

      const loggedInWith = localStorage.getItem('loggedInWith')
      if (loggedInWith) {
        initializeClientWrapper(dispatch, getState, loggedInWith as WALLET_KIND)
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

export const initializeMagicLinkWallet = (email: string) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setAppStatus(APP_STATUS.LOADING))
      initializeClientWrapper(
        dispatch,
        getState,
        WALLET_KIND.WALLET_MAGIC_LINK,
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

const subscribeDepositEvent = (client: LightClient) => {
  return (dispatch, getState) => {
    client.subscribeDepositEvent((userAction: UserAction) => {
      console.info(
        `subscribe deposit event { userAction: ${JSON.stringify(userAction)}) }`
      )
      subscribedEventGetters(dispatch, getState)
    })
  }
}

const subscribeSyncStartedEvent = (client: LightClient) => {
  return dispatch => {
    client.subscribeSyncBlockStarted((blockNumber: BigNumber) => {
      console.info(`syncing... ${blockNumber.data}`)
      dispatch(setSyncingStatus(SYNCING_STATUS.LOADING))
    })

    client.subscribeSyncBlocksStarted(({ from, to }) => {
      console.info(`syncing... from ${from.data} to ${to.data}`)
      dispatch(setSyncingStatus(SYNCING_STATUS.LOADING))
    })
  }
}

const subscribeSyncFinishedEvent = (client: LightClient) => {
  return (dispatch, getState) => {
    client.subscribeSyncBlockFinished((blockNumber: BigNumber) => {
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

const subscribeTransferCompleteEvent = (client: LightClient) => {
  return (dispatch: Dispatch, getState) => {
    client.subscribeTransferComplete((stateUpdate: StateUpdate) => {
      console.info(
        `%c transfer complete for range: %c (${stateUpdate.range.start.data}, ${stateUpdate.range.end.data})`,
        'color: brown; font-weight: bold;',
        'font-weight: bold;'
      )
      subscribedEventGetters(dispatch, getState)
    })
  }
}

const subscribeExitFinalizedEvent = (client: LightClient) => {
  return (dispatch: Dispatch, getState) => {
    client.subscribeExitFinalized(async (exit: Exit) => {
      console.info(`completed withdrawal: ${exit}`)
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
      const client = clientWrapper.client
      if (!client) {
        throw new Error('client is not initialized yet.')
      }
      dispatch(subscribeSyncStartedEvent(client))
      dispatch(subscribeSyncFinishedEvent(client))
      dispatch(subscribeDepositEvent(client))
      dispatch(subscribeTransferCompleteEvent(client))
      dispatch(subscribeExitFinalizedEvent(client))
    } catch (e) {
      console.error(e)
      dispatch(pushToast({ message: e.message, type: 'error' }))
    }
  }
}
