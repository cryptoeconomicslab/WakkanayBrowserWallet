import { Dispatch } from 'redux'
import { createAction, createReducer } from '@reduxjs/toolkit'
import axios from 'axios'
import { AppState } from './'
import { pushToast } from './toast'
import { ActionType, STATE_LOADING_STATUS } from './types'

const ETH_LATEST_PRICE_URL =
  'https://api.etherscan.io/api?module=stats&action=ethprice&apikey=ANJAFJARGHU6JKSBJ7G6YG4N3TSKUMV2PG'

export enum ETH_USD_RATE_ACTION_TYPES {
  SET_ETH_USD_RATE = 'SET_ETH_USD_RATE',
  SET_ETH_USD_RATE_STATUS = 'SET_ETH_USD_RATE_STATUS',
  SET_ETH_USD_RATE_ERROR = 'SET_ETH_USD_RATE_ERROR'
}
export interface State {
  rate: number
  status: STATE_LOADING_STATUS
  error: Error | null
}

const initialState: State = {
  rate: 0,
  status: STATE_LOADING_STATUS.UNLOADED,
  error: null
}

export const setEthUsdRate = createAction<number>(
  ETH_USD_RATE_ACTION_TYPES.SET_ETH_USD_RATE
)
export const setEthUsdRateStatus = createAction<string>(
  ETH_USD_RATE_ACTION_TYPES.SET_ETH_USD_RATE_STATUS
)
export const setEthUsdRateError = createAction<Error>(
  ETH_USD_RATE_ACTION_TYPES.SET_ETH_USD_RATE_ERROR
)

const reducer = createReducer(initialState, {
  [setEthUsdRate.type]: (
    state: State,
    action: ActionType<ETH_USD_RATE_ACTION_TYPES>
  ) => {
    state.rate = action.payload
    state.status = STATE_LOADING_STATUS.LOADED
  },
  [setEthUsdRateStatus.type]: (
    state: State,
    action: ActionType<ETH_USD_RATE_ACTION_TYPES>
  ) => {
    state.status = action.payload
  },
  [setEthUsdRateError.type]: (
    state: State,
    action: ActionType<ETH_USD_RATE_ACTION_TYPES>
  ) => {
    state.error = action.payload
    state.status = STATE_LOADING_STATUS.ERROR
  }
})

export default reducer

export const getEthUsdRate = () => {
  return async (dispatch: Dispatch, getState: () => AppState) => {
    try {
      if (getState().ethUsdRate.status === STATE_LOADING_STATUS.LOADING) {
        return
      }

      dispatch(setEthUsdRateStatus(STATE_LOADING_STATUS.LOADING))
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
