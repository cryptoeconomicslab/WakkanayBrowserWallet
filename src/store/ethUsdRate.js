import { createAction, createReducer } from '@reduxjs/toolkit'
import axios from 'axios'

const ETH_LATEST_PRICE_URL =
  'https://api.etherscan.io/api?module=stats&action=ethprice&apikey=ANJAFJARGHU6JKSBJ7G6YG4N3TSKUMV2PG'

export const ETH_USD_RATE_PROGRESS = {
  UNLOADED: 'UNLOADED',
  LOADING: 'LOADING',
  LOADED: 'LOADED',
  ERROR: 'ERROR'
}

export const setEthUsdRate = createAction('SET_ETH_USD_RATE')
export const setEthUsdRateStatus = createAction('SET_ETH_USD_RATE_STATUS')
export const setEthUsdRateError = createAction('SET_ETH_USD_RATE_ERROR')

export const ethUsdRateReducer = createReducer(
  {
    rate: 0,
    status: ETH_USD_RATE_PROGRESS.UNLOADED,
    error: false
  },
  {
    [setEthUsdRate]: (state, action) => {
      state.rate = action.payload
      state.status = ETH_USD_RATE_PROGRESS.LOADED
    },
    [setEthUsdRateStatus]: (state, action) => {
      state.status = action.payload
    },
    [setEthUsdRateError]: (state, action) => {
      state.error = action.payload
      state.status = ETH_USD_RATE_PROGRESS.ERROR
    }
  }
)

export const getEthUsdRate = () => {
  return async dispatch => {
    dispatch(setEthUsdRateStatus(ETH_USD_RATE_PROGRESS.LOADING))
    axios
      .get(ETH_LATEST_PRICE_URL)
      .then(async res => {
        if (res.data && res.data.result && res.data.result.ethusd) {
          dispatch(setEthUsdRate(res.data.result.ethusd))
        } else {
          throw Error('Can not get res.data.')
        }
      })
      .catch(async e => {
        console.error(e)
        dispatch(setEthUsdRateStatus(e.message))
      })
  }
}
