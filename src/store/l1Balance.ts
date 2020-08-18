import { ThunkAction } from 'redux-thunk'
import { Dispatch } from 'redux'
import { createAction, createReducer } from '@reduxjs/toolkit'
import { formatUnits } from 'ethers/utils'
import { Address } from '@cryptoeconomicslab/primitives'
import clientWrapper from '../client'
import { TOKEN_LIST } from '../constants/tokens'
import { BalanceList } from './../types/Balance'
import { roundBalance } from '../utils'
import { AppState } from './'
import { pushToast } from './toast'

export enum L1_BALANCE_ACTION_TYPES {
  SET_L1_BALANCE = 'SET_L1_BALANCE',
  SET_L1_BALANCE_STATUS = 'SET_L1_BALANCE_STATUS',
  SET_L1_BALANCE_ERROR = 'SET_L1_BALANCE_ERROR'
}

export const L1_BALANCE_PROGRESS = {
  UNLOADED: 'UNLOADED',
  LOADING: 'LOADING',
  LOADED: 'LOADED',
  ERROR: 'ERROR'
}

export interface State {
  balanceList: object
  status: string
  error: Error | null
}

const initialState: State = {
  balanceList: {},
  status: L1_BALANCE_PROGRESS.UNLOADED,
  error: null
}

interface L1BalanceAction {
  type: L1_BALANCE_ACTION_TYPES
  payload?: any
  error?: boolean
}

export const setL1Balance = createAction<object>(
  L1_BALANCE_ACTION_TYPES.SET_L1_BALANCE
)
export const setL1BalanceStatus = createAction<string>(
  L1_BALANCE_ACTION_TYPES.SET_L1_BALANCE_STATUS
)
export const setL1BalanceError = createAction<Error>(
  L1_BALANCE_ACTION_TYPES.SET_L1_BALANCE_ERROR
)

const reducer = createReducer(initialState, {
  [setL1Balance.type]: (state: State, action: L1BalanceAction) => {
    state.balanceList = action.payload
    state.status = L1_BALANCE_PROGRESS.LOADED
  },
  [setL1BalanceStatus.type]: (state: State, action: L1BalanceAction) => {
    state.status = action.payload
  },
  [setL1BalanceError.type]: (state: State, action: L1BalanceAction) => {
    state.error = action.payload
    state.status = L1_BALANCE_PROGRESS.ERROR
  }
})

export default reducer

export const getL1Balance = (): ThunkAction<void, AppState, void, any> => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(setL1BalanceStatus(L1_BALANCE_PROGRESS.LOADING))
      const client = clientWrapper.getClient()
      if (!client) return
      const balanceList: BalanceList = await TOKEN_LIST.reduce(
        async (map, token) => {
          let balance
          if (token.unit === 'ETH') {
            balance = await clientWrapper.wallet.getL1Balance()
          } else {
            balance = await clientWrapper.wallet.getL1Balance(
              // TODO: don't use gazelle primitives
              Address.from(token.tokenContractAddress)
            )
          }
          map[token.unit] = {
            amount: roundBalance(
              formatUnits(balance.value.raw, balance.decimals)
            ),
            decimals: balance.decimals
          }
          return map
        },
        {}
      )
      dispatch(setL1Balance(balanceList))
    } catch (e) {
      console.error(e)
      dispatch(setL1BalanceError(e))
      dispatch(
        pushToast({ message: 'Get your L1 balance failed.', type: 'error' })
      )
    }
  }
}