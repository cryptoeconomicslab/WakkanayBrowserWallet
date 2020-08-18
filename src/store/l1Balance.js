import { Address } from '@cryptoeconomicslab/primitives'
import { createAction, createReducer } from '@reduxjs/toolkit'
import { formatUnits } from 'ethers/utils'
import clientWrapper from '../client'
import { TOKEN_LIST } from '../constants/tokens'
import { pushToast } from './toast'
import { roundBalance } from '../utils'

export const L1_BALANCE_PROGRESS = {
  UNLOADED: 'UNLOADED',
  LOADING: 'LOADING',
  LOADED: 'LOADED',
  ERROR: 'ERROR'
}

export const setL1Balance = createAction('SET_L1_BALANCE')
export const setL1BalanceStatus = createAction('SET_L1_BALANCE_STATUS')
export const setL1BalanceError = createAction('SET_L1_BALANCE_ERROR')

export const l1BalanceReducer = createReducer(
  {
    balanceList: {},
    status: L1_BALANCE_PROGRESS.UNLOADED,
    error: null
  },
  {
    [setL1Balance]: (state, action) => {
      state.balanceList = action.payload
      state.status = L1_BALANCE_PROGRESS.LOADED
    },
    [setL1BalanceStatus]: (state, action) => {
      state.status = action.payload
    },
    [setL1BalanceError]: (state, action) => {
      state.error = action.payload
      state.status = L1_BALANCE_PROGRESS.ERROR
    }
  }
)

export const getL1Balance = () => {
  return async (dispatch, getState) => {
    try {
      if (getState().l1Balance.status === L1_BALANCE_PROGRESS.LOADING) {
        return
      }

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
      dispatch(setL1BalanceError(e))
      dispatch(
        pushToast({ message: 'Get your L1 balance failed.', type: 'error' })
      )
    }
  }
}
