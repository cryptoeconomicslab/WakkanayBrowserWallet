import { createAction, createReducer } from '@reduxjs/toolkit'
import { formatUnits } from 'ethers/utils'
import clientWrapper from '../client'
import { getTokenByTokenContractAddress } from '../constants/tokens'
import { pushToast } from './toast'
import { roundBalance } from '../utils'

export const L2_BALANCE_PROGRESS = {
  UNLOADED: 'UNLOADED',
  LOADING: 'LOADING',
  LOADED: 'LOADED',
  ERROR: 'ERROR'
}

export const setL2Balance = createAction('SET_L2_BALANCE')
export const setL2BalanceStatus = createAction('SET_L2_BALANCE_STATUS')
export const setL2BalanceError = createAction('SET_L2_BALANCE_ERROR')

export const l2BalanceReducer = createReducer(
  {
    balanceList: {},
    status: L2_BALANCE_PROGRESS.UNLOADED,
    error: null
  },
  {
    [setL2Balance]: (state, action) => {
      state.balanceList = action.payload
      state.status = L2_BALANCE_PROGRESS.LOADED
    },
    [setL2BalanceStatus]: (state, action) => {
      state.status = action.payload
    },
    [setL2BalanceError]: (state, action) => {
      state.error = action.payload
      state.status = L2_BALANCE_PROGRESS.ERROR
    }
  }
)

export const getL2Balance = () => {
  return async (dispatch, getState) => {
    try {
      if (getState().l2Balance.status === L2_BALANCE_PROGRESS.LOADING) {
        return
      }

      dispatch(setL2BalanceStatus(L2_BALANCE_PROGRESS.LOADING))
      const client = await clientWrapper.getClient()
      if (!client) return
      const balanceList = await client.getBalance()
      const formatedBalanceList = balanceList.reduce((map, balance) => {
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
      }, {})
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
