import { Address } from '@cryptoeconomicslab/primitives'
import { createAction, createReducer } from '@reduxjs/toolkit'
import { formatUnits } from 'ethers/utils'
import clientWrapper from '../client'
import { TOKEN_LIST } from '../constants/tokens'
import { pushError } from './error'
import { roundBalance } from '../utils'

export const L1_BALANCE_PROGRESS = {
  UNLOADED: 'UNLOADED',
  LOADING: 'LOADING',
  LOADED: 'LOADED',
  ERROR: 'ERROR'
}

export const setL1Balance = createAction('SET_L1_BALANCE')
export const setL1BalanceStatus = createAction('SET_L1_BALANCE_STATUS')

export const l1BalanceReducer = createReducer(
  {
    balanceList: {},
    status: L1_BALANCE_PROGRESS.UNLOADED
  },
  {
    [setL1Balance]: (state, action) => {
      state.balanceList = action.payload
      state.status = L1_BALANCE_PROGRESS.LOADED
    },
    [setL1BalanceStatus]: (state, action) => {
      state.status = action.payload
    }
  }
)

export const getL1Balance = () => {
  return async dispatch => {
    try {
      dispatch(setL1BalanceStatus(L1_BALANCE_PROGRESS.LOADING))
      const client = await clientWrapper.getClient()
      if (!client) return
      const balanceList = await TOKEN_LIST.reduce(async (map, token) => {
        let balance = 0
        if (token.unit === 'ETH') {
          balance = await client.wallet.getL1Balance()
        } else {
          balance = await client.wallet.getL1Balance(
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
      }, {})
      dispatch(setL1Balance(balanceList))
    } catch (e) {
      console.error(e)
      dispatch(setL1BalanceStatus(L1_BALANCE_PROGRESS.ERROR))
      dispatch(pushError('Get your L1 balance failed.'))
    }
  }
}
