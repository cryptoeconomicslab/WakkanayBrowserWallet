import { Dispatch } from 'redux'
import { createAction, createReducer } from '@reduxjs/toolkit'
import { formatUnits } from 'ethers/utils'
import { Balance as WalletBalance } from '@cryptoeconomicslab/wallet'
import { Address } from '@cryptoeconomicslab/primitives'
import clientWrapper from '../client'
import TOKEN_LIST from '../constants/tokens'
import { AppState } from '../store'
import { Balance, BalanceList } from './../types/Balance'
import { roundBalance } from '../utils'
import { pushToast } from './toast'
import { ActionType, STATE_LOADING_STATUS } from './types'

export enum L1_BALANCE_ACTION_TYPES {
  SET_L1_BALANCE = 'SET_L1_BALANCE',
  SET_L1_BALANCE_STATUS = 'SET_L1_BALANCE_STATUS',
  SET_L1_BALANCE_ERROR = 'SET_L1_BALANCE_ERROR'
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

export const setL1Balance = createAction<BalanceList>(
  L1_BALANCE_ACTION_TYPES.SET_L1_BALANCE
)
export const setL1BalanceStatus = createAction<string>(
  L1_BALANCE_ACTION_TYPES.SET_L1_BALANCE_STATUS
)
export const setL1BalanceError = createAction<Error>(
  L1_BALANCE_ACTION_TYPES.SET_L1_BALANCE_ERROR
)

const reducer = createReducer(initialState, {
  [setL1Balance.type]: (
    state: State,
    action: ActionType<L1_BALANCE_ACTION_TYPES>
  ) => {
    state.balanceList = action.payload
    state.status = STATE_LOADING_STATUS.LOADED
  },
  [setL1BalanceStatus.type]: (
    state: State,
    action: ActionType<L1_BALANCE_ACTION_TYPES>
  ) => {
    state.status = action.payload
  },
  [setL1BalanceError.type]: (
    state: State,
    action: ActionType<L1_BALANCE_ACTION_TYPES>
  ) => {
    state.error = action.payload
    state.status = STATE_LOADING_STATUS.ERROR
  }
})

export default reducer

export const getL1Balance = () => {
  return async (dispatch: Dispatch, getState: () => AppState) => {
    try {
      if (getState().l1Balance.status === STATE_LOADING_STATUS.LOADING) {
        return
      }

      dispatch(setL1BalanceStatus(STATE_LOADING_STATUS.LOADING))
      const client = clientWrapper.client
      const wallet = clientWrapper.wallet
      if (!client || !wallet) return
      const balanceList: BalanceList = await TOKEN_LIST.reduce(
        async (map, token) => {
          let balance: WalletBalance
          if (token.unit === 'ETH') {
            balance = await wallet.getL1Balance()
          } else {
            balance = await wallet.getL1Balance(
              // TODO: don't use gazelle primitives
              Address.from(token.tokenContractAddress)
            )
          }
          if (token) {
            map[token.unit] = {
              amount: roundBalance(
                Number(formatUnits(balance.value.raw, balance.decimals))
              ),
              decimals: balance.decimals
            } as Balance
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
