import { Dispatch } from 'redux'
import { createAction, createReducer } from '@reduxjs/toolkit'
import axios from 'axios'
import { pushToast } from './toast'

const ETH_LATEST_PRICE_URL =
  'https://api.etherscan.io/api?module=stats&action=ethprice&apikey=ANJAFJARGHU6JKSBJ7G6YG4N3TSKUMV2PG'

export enum ETH_USD_RATE_TYPES {
  SET_ETH_USD_RATE = 'SET_ETH_USD_RATE',
  SET_ETH_USD_RATE_STATUS = 'SET_ETH_USD_RATE_STATUS',
  SET_ETH_USD_RATE_ERROR = 'SET_ETH_USD_RATE_ERROR'
}

export const ETH_USD_RATE_PROGRESS = {
  UNLOADED: 'UNLOADED',
  LOADING: 'LOADING',
  LOADED: 'LOADED',
  ERROR: 'ERROR'
}

export interface State {
  rate: number
  status: string
  error: Error | null
}

const initialState: State = {
  rate: 0,
  status: ETH_USD_RATE_PROGRESS.UNLOADED,
  error: null
}

interface EthUsdRateAction {
  type: ETH_USD_RATE_TYPES
  payload?: any
  error?: boolean
}

export const setEthUsdRate = createAction<number>(
  ETH_USD_RATE_TYPES.SET_ETH_USD_RATE
)
export const setEthUsdRateStatus = createAction<string>(
  ETH_USD_RATE_TYPES.SET_ETH_USD_RATE_STATUS
)
export const setEthUsdRateError = createAction<Error>(
  ETH_USD_RATE_TYPES.SET_ETH_USD_RATE_ERROR
)

const reducer = createReducer(initialState, {
  [setEthUsdRate.type]: (state: State, action: EthUsdRateAction) => {
    state.rate = action.payload
    state.status = ETH_USD_RATE_PROGRESS.LOADED
  },
  [setEthUsdRateStatus.type]: (state: State, action: EthUsdRateAction) => {
    state.status = action.payload
  },
  [setEthUsdRateError.type]: (state: State, action: EthUsdRateAction) => {
    state.error = action.payload
    state.status = ETH_USD_RATE_PROGRESS.ERROR
  }
})

export default reducer

export const getEthUsdRate = () => {
  return async (dispatch: Dispatch, getState) => {
    try {
      if (getState().ethUsdRate.status === ETH_USD_RATE_PROGRESS.LOADING) {
        return
      }

      dispatch(setEthUsdRateStatus(ETH_USD_RATE_PROGRESS.LOADING))
      const res = await axios.get(ETH_LATEST_PRICE_URL)
      if (res.data && res.data.result && res.data.result.ethusd) {
        dispatch(setEthUsdRate(res.data.result.ethusd))
      } else {
        throw Error('Get res.data failed.')
      }
    } catch (e) {
      console.error(e)
      dispatch(setEthUsdRateError(e))
      dispatch(
        pushToast({ message: 'Get ETH-USD rate failed.', type: 'error' })
      )
    }
  }
}
