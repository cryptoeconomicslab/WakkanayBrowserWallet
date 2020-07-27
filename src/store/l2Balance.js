import { createAction, createReducer } from '@reduxjs/toolkit'
import { formatUnits } from 'ethers/utils'
import clientWrapper from '../client'
import { getTokenByTokenContractAddress } from '../constants/tokens'
import { pushError } from './error'
import { roundBalance } from '../utils'

export const L2_BALANCE_PROGRESS = {
  UNLOADED: 'UNLOADED',
  LOADING: 'LOADING',
  LOADED: 'LOADED',
  ERROR: 'ERROR'
}

export const setL2Balance = createAction('SET_L2_BALANCE')
export const setL2BalanceStatus = createAction('SET_L2_BALANCE_STATUS')

export const l2BalanceReducer = createReducer(
  {
    balanceList: {},
    status: L2_BALANCE_PROGRESS.UNLOADED
  },
  {
    [setL2Balance]: (state, action) => {
      state.balanceList = action.payload
      state.status = L2_BALANCE_PROGRESS.LOADED
    },
    [setL2BalanceStatus]: (state, action) => {
      state.status = action.payload
    }
  }
)

export const getL2Balance = () => {
  return async dispatch => {
    try {
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
      dispatch(setL2BalanceStatus(L2_BALANCE_PROGRESS.ERROR))
      dispatch(pushError('Get your L2 balance failed.'))
    }
  }
}
