import { Address } from '@cryptoeconomicslab/primitives'
import { createAction, createReducer } from '@reduxjs/toolkit'
import axios from 'axios'
import { formatUnits } from 'ethers/utils'
import { createSelector } from 'reselect'
import clientWrapper from '../client'
import { TOKEN_LIST, getTokenByTokenContractAddress } from '../constants/tokens'
import { roundBalance } from '../utils'

// selector
const getL1BalanceState = state => state.tokenBalance.l1Balance
const getTokenBalanceState = state => state.tokenBalance.tokenBalance
const getEthToUsdState = state => state.tokenBalance.ETHtoUSD

const calcTotalBalance = (balance, ethToUsd) => {
  let total = 0
  for (const [key, value] of Object.entries(balance)) {
    if (key === 'ETH') {
      total += value.amount * ethToUsd
    } else {
      total += value.amount
    }
  }
  return roundBalance(total)
}

export const getL1TotalBalance = createSelector(
  [getL1BalanceState, getEthToUsdState],
  (l1Balance, ethToUsd) => {
    return calcTotalBalance(l1Balance, ethToUsd)
  }
)

export const getTokenTotalBalance = createSelector(
  [getTokenBalanceState, getEthToUsdState],
  (tokenBalance, ethToUsd) => {
    return calcTotalBalance(tokenBalance, ethToUsd)
  }
)

// actions
export const setL1Balance = createAction('SET_L1_BALANCE')
export const setL1BalanceError = createAction('SET_L1_BALANCE_ERROR')
export const setTokenBalance = createAction('SET_TOKEN_BALANCE')
export const setTokenBalanceError = createAction('SET_TOKEN_BALANCE_ERROR')
export const setETHtoUSD = createAction('SET_ETH_TO_USD')
export const setETHtoUSDError = createAction('SET_ETH_TO_USD_ERROR')

export const getL1Balance = () => {
  return async dispatch => {
    try {
      dispatch(setL1BalanceError(false))
      const client = await clientWrapper.getClient()
      if (!client) return
      const balances = await TOKEN_LIST.reduce(async (map, token) => {
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
      dispatch(setL1Balance(balances))
    } catch (e) {
      console.error(e)
      dispatch(setL1BalanceError(true))
    }
  }
}

// thunk action: higher order function to get deposited token balance from mock client
export const getBalance = () => {
  return async dispatch => {
    try {
      dispatch(setTokenBalanceError(false))
      const client = await clientWrapper.getClient()
      if (!client) return
      const balanceList = await client.getBalance()
      const balance = balanceList.reduce((map, balance) => {
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
      dispatch(setTokenBalance(balance))
    } catch (e) {
      console.error(e)
      dispatch(setTokenBalanceError(true))
    }
  }
}

// thunk action: higher order function to get deposited token's fiat balance
const EtherLatestPriceURL =
  'https://api.etherscan.io/api?module=stats&action=ethprice&apikey=ANJAFJARGHU6JKSBJ7G6YG4N3TSKUMV2PG'

export const getETHtoUSD = () => {
  return async dispatch => {
    dispatch(setETHtoUSDError(false))
    axios
      .get(EtherLatestPriceURL)
      .then(async res => {
        if (res.data && res.data.result && res.data.result.ethusd) {
          dispatch(setETHtoUSD(res.data.result.ethusd))
        } else {
          throw Error('Can not get res.data.')
        }
      })
      .catch(async e => {
        console.error(e)
        dispatch(setETHtoUSDError(true))
      })
  }
}

export const tokenBalanceReducer = createReducer(
  {
    l1Balance: {},
    l1BalanceError: false,
    tokenBalance: {},
    tokenBalanceError: false,
    ETHtoUSD: 0,
    ethToUSDError: false
  },
  {
    [setL1Balance]: (state, action) => {
      state.l1Balance = action.payload
    },
    [setL1BalanceError]: (state, action) => {
      state.l1BalanceError = action.payload
    },
    [setTokenBalance]: (state, action) => {
      state.tokenBalance = action.payload
    },
    [setTokenBalanceError]: (state, action) => {
      state.tokenBalanceError = action.payload
    },
    [setETHtoUSD]: (state, action) => {
      state.ETHtoUSD = action.payload
    },
    [setETHtoUSDError]: (state, action) => {
      state.ethToUSDError = action.payload
    }
  }
)
