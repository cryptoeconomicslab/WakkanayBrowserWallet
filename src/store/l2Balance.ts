import { Dispatch } from 'redux'
import { createAction, createReducer } from '@reduxjs/toolkit'
import { formatUnits } from 'ethers/utils'
import clientWrapper from '../client'
import { getTokenByTokenContractAddress } from '../constants/tokens'
import { AppState } from '../store'
import { Balance, BalanceList } from '../types/Balance'
import { pushToast } from './toast'
import { ActionType, STATE_LOADING_STATUS } from './types'
import { roundBalance } from '../utils'

export enum L2_BALANCE_ACTION_TYPES {
  SET_L2_BALANCE = 'SET_L2_BALANCE',
  SET_L2_BALANCE_STATUS = 'SET_L2_BALANCE_STATUS',
  SET_L2_BALANCE_ERROR = 'SET_L2_BALANCE_ERROR'
}

export interface State {
  balanceList: BalanceList
  status: STATE_LOADING_STATUS
  error: Error | null
}

const initialState: State = {
  balanceList: {},
  status: STATE_LOADING_STATUS.UNLOADED,
  error: null
}

export const setL2Balance = createAction<BalanceList>(
  L2_BALANCE_ACTION_TYPES.SET_L2_BALANCE
)
export const setL2BalanceStatus = createAction<string>(
  L2_BALANCE_ACTION_TYPES.SET_L2_BALANCE_STATUS
)
export const setL2BalanceError = createAction<Error>(
  L2_BALANCE_ACTION_TYPES.SET_L2_BALANCE_ERROR
)

const reducer = createReducer(initialState, {
  [setL2Balance.type]: (
    state: State,
    action: ActionType<L2_BALANCE_ACTION_TYPES>
  ) => {
    state.balanceList = action.payload
    state.status = STATE_LOADING_STATUS.LOADED
  },
  [setL2BalanceStatus.type]: (
    state: State,
    action: ActionType<L2_BALANCE_ACTION_TYPES>
  ) => {
    state.status = action.payload
  },
  [setL2BalanceError.type]: (
    state: State,
    action: ActionType<L2_BALANCE_ACTION_TYPES>
  ) => {
    state.error = action.payload
    state.status = STATE_LOADING_STATUS.ERROR
  }
})

export default reducer

export const getL2Balance = () => {
  return async (dispatch: Dispatch, getState: () => AppState) => {
    try {
      if (getState().l2Balance.status === STATE_LOADING_STATUS.LOADING) {
        return
      }

      dispatch(setL2BalanceStatus(STATE_LOADING_STATUS.LOADING))
      const client = clientWrapper.client
      if (!client) return
      const balanceList = await client.getBalance()
      const formatedBalanceList: BalanceList = balanceList.reduce(
        (map, balance) => {
          const token = getTokenByTokenContractAddress(
            balance.tokenContractAddress
          )
          if (token) {
            map[token.unit] = {
              amount: roundBalance(
                Number(formatUnits(balance.amount.toString(), balance.decimals))
              ),
              decimals: balance.decimals
            } as Balance
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
