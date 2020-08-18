import { Dispatch } from 'redux'
import { createAction, createReducer } from '@reduxjs/toolkit'
import { formatUnits } from 'ethers/utils'
import clientWrapper from '../client'
import { getTokenByTokenContractAddress } from '../constants/tokens'
import { pushToast } from './toast'
import { BalanceList } from './../types/Balance'
import { roundBalance } from '../utils'

export enum L2_BALANCE_ACTION_TYPES {
  SET_L2_BALANCE = 'SET_L2_BALANCE',
  SET_L2_BALANCE_STATUS = 'SET_L2_BALANCE_STATUS',
  SET_L2_BALANCE_ERROR = 'SET_L2_BALANCE_ERROR'
}

export const L2_BALANCE_PROGRESS = {
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
  status: L2_BALANCE_PROGRESS.UNLOADED,
  error: null
}

interface L2BalanceAction {
  type: L2_BALANCE_ACTION_TYPES
  payload?: any
  error?: boolean
}

export const setL2Balance = createAction<object>(
  L2_BALANCE_ACTION_TYPES.SET_L2_BALANCE
)
export const setL2BalanceStatus = createAction<string>(
  L2_BALANCE_ACTION_TYPES.SET_L2_BALANCE_STATUS
)
export const setL2BalanceError = createAction<Error>(
  L2_BALANCE_ACTION_TYPES.SET_L2_BALANCE_ERROR
)

const reducer = createReducer(initialState, {
  [setL2Balance.type]: (state: State, action: L2BalanceAction) => {
    state.balanceList = action.payload
    state.status = L2_BALANCE_PROGRESS.LOADED
  },
  [setL2BalanceStatus.type]: (state: State, action: L2BalanceAction) => {
    state.status = action.payload
  },
  [setL2BalanceError.type]: (state: State, action: L2BalanceAction) => {
    state.error = action.payload
    state.status = L2_BALANCE_PROGRESS.ERROR
  }
})

export default reducer

export const getL2Balance = () => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(setL2BalanceStatus(L2_BALANCE_PROGRESS.LOADING))
      const client = clientWrapper.getClient()
      if (!client) return
      const balanceList = await client.getBalance()
      const formatedBalanceList: BalanceList = balanceList.reduce(
        (map, balance) => {
          const token = getTokenByTokenContractAddress(
            balance.tokenContractAddress
          )
          map[token.unit] = {
            amount: roundBalance(
              formatUnits(balance.amount.toString(), balance.decimals)
            ),
            decimals: balance.decimals
          }
          return map
        },
        {}
      )
      dispatch(setL2Balance(formatedBalanceList))
    } catch (e) {
      console.error(e)
      dispatch(setL2BalanceError(e))
      dispatch(
        pushToast({ message: 'Get your L2 balance failed.', type: 'error' })
      )
    }
  }
}
