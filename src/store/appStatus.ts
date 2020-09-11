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
import { AppState } from './'
import { getAddress } from './address'
import { getEthUsdRate } from './ethUsdRate'
import { getPendingExitList } from './pendingExitList'
import { pushToast } from './toast'
import { getL1Balance } from './l1Balance'
import { getL2Balance } from './l2Balance'
import { getTransactionHistories } from './transactionHistory'
import { ActionType, STATE_LOADING_STATUS } from './types'

export enum APP_STATUS_ACTION_TYPES {
  SET_APP_STATUS = 'SET_APP_STATUS',
  SET_APP_ERROR = 'SET_APP_ERROR'
}

export enum SYNCING_STATUS_ACTION_TYPES {
  SET_SYNCING_STATUS = 'SET_SYNCING_STATUS'
}

export interface State {
  status: string
  error: Error | null
  syncingStatus: STATE_LOADING_STATUS
}

const initialState: State = {
  status: STATE_LOADING_STATUS.UNLOADED,
  error: null,
  syncingStatus: STATE_LOADING_STATUS.LOADED
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
    state.status = STATE_LOADING_STATUS.ERROR
  },
  [setSyncingStatus.type]: (
    state: State,
    action: ActionType<SYNCING_STATUS_ACTION_TYPES>
  ) => {
    state.syncingStatus = action.payload
  }
})

export default reducer

export const initialGetters = (dispatch, getState: () => AppState) => {
  if (getState().appStatus.syncingStatus === STATE_LOADING_STATUS.LOADED) {
    dispatch(getEthUsdRate())
    dispatch(getAddress())
    dispatch(getL1Balance())
    dispatch(getL2Balance())
    dispatch(getTransactionHistories())
    dispatch(getPendingExitList())
  }
}
const subscribedEventGetters = (dispatch, getState: () => AppState) => {
  if (getState().appStatus.syncingStatus === STATE_LOADING_STATUS.LOADED) {
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
    dispatch(setSyncingStatus(STATE_LOADING_STATUS.LOADED))
    initialGetters(dispatch, getState)
  })
  initialGetters(dispatch, getState)
}

export const checkClientInitialized = () => {
  return async (dispatch, getState: () => AppState) => {
    if (!process.browser) {
      dispatch(setAppStatus(STATE_LOADING_STATUS.UNLOADED))
      return
    }

    try {
      dispatch(setAppStatus(STATE_LOADING_STATUS.LOADING))
      setupContext({ coder: EthCoder })
      const client = clientWrapper.client
      if (client) {
        dispatch(subscribeEvents())
        initialGetters(dispatch, getState)
        dispatch(setAppStatus(STATE_LOADING_STATUS.LOADED))
        return
      }

      const loggedInWith = localStorage.getItem('loggedInWith')
      if (loggedInWith) {
        initializeClientWrapper(dispatch, getState, loggedInWith as WALLET_KIND)
        dispatch(setAppStatus(STATE_LOADING_STATUS.LOADED))
      } else {
        dispatch(setAppStatus(STATE_LOADING_STATUS.UNLOADED))
      }
    } catch (e) {
      console.error(e)
      dispatch(pushToast({ message: e.message, type: 'error' }))
      dispatch(setAppError(e))
    }
  }
}

export const initializeMetamaskWallet = () => {
  return async (dispatch, getState: () => AppState) => {
    try {
      dispatch(setAppStatus(STATE_LOADING_STATUS.LOADING))
      initializeClientWrapper(dispatch, getState, WALLET_KIND.WALLET_METAMASK)
      dispatch(setAppStatus(STATE_LOADING_STATUS.LOADED))
    } catch (e) {
      console.error(e)
      dispatch(pushToast({ message: e.message, type: 'error' }))
      dispatch(setAppError(e))
    }
  }
}

export const initializeWalletConnect = () => {
  return async (dispatch, getState: () => AppState) => {
    try {
      dispatch(setAppStatus(STATE_LOADING_STATUS.LOADING))
      initializeClientWrapper(dispatch, getState, WALLET_KIND.WALLET_CONNECT)
      dispatch(setAppStatus(STATE_LOADING_STATUS.LOADED))
    } catch (e) {
      console.error(e)
      dispatch(pushToast({ message: e.message, type: 'error' }))
      dispatch(setAppError(e))
    }
  }
}

export const initializeMagicLinkWallet = (email: string) => {
  return async (dispatch, getState: () => AppState) => {
    try {
      dispatch(setAppStatus(STATE_LOADING_STATUS.LOADING))
      initializeClientWrapper(
        dispatch,
        getState,
        WALLET_KIND.WALLET_MAGIC_LINK,
        email
      )
      dispatch(setAppStatus(STATE_LOADING_STATUS.LOADED))
    } catch (e) {
      console.error(e)
      dispatch(pushToast({ message: e.message, type: 'error' }))
      dispatch(setAppError(e))
    }
  }
}

const subscribeDepositEvent = (client: LightClient) => {
  return (dispatch, getState: () => AppState) => {
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
      dispatch(setSyncingStatus(STATE_LOADING_STATUS.LOADING))
    })

    client.subscribeSyncBlocksStarted(({ from, to }) => {
      console.info(`syncing... from ${from.data} to ${to.data}`)
      dispatch(setSyncingStatus(STATE_LOADING_STATUS.LOADING))
    })
  }
}

const subscribeSyncFinishedEvent = (client: LightClient) => {
  return (dispatch, getState: () => AppState) => {
    client.subscribeSyncBlockFinished((blockNumber: BigNumber) => {
      console.info(`sync new state: ${blockNumber.data}`)
      dispatch(setSyncingStatus(STATE_LOADING_STATUS.LOADED))
      subscribedEventGetters(dispatch, getState)
    })

    client.subscribeSyncBlocksFinished(({ from, to }) => {
      console.info(`sync new state: from ${from.data} to ${to.data}`)
      dispatch(setSyncingStatus(STATE_LOADING_STATUS.LOADED))
      subscribedEventGetters(dispatch, getState)
    })
  }
}

const subscribeTransferCompleteEvent = (client: LightClient) => {
  return (dispatch: Dispatch, getState: () => AppState) => {
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
  return (dispatch: Dispatch, getState: () => AppState) => {
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
