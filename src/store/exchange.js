import { createAction, createReducer } from '@reduxjs/toolkit'

export const setExchangedToken = createAction('SET_EXCHANGED_TOKEN')
export const setMaxExchangedAmount = createAction('SET_MAX_EXCHANGED_AMOUNT')
export const setReceivedToken = createAction('SET_RECEIVED_TOKEN')
export const setOrderRequestPage = createAction('SET_ORDER_REQUEST_PAGE')
export const setRequestedTokenToExchange = createAction(
  'SET_REQUESTED_TOKEN_TO_EXCHANGE'
)
export const setRequestedAmountToExchange = createAction(
  'SET_REQUESTED_AMOUNT_TO_EXCHANGE'
)
export const setRequestedTokenToReceive = createAction(
  'SET_REQUESTED_TOKEN_TO_RECEIVE'
)
export const setRequestedAmountToReceive = createAction(
  'SET_REQUESTED_AMOUNT_TO_RECEIVE'
)

export const exchangeReducer = createReducer(
  {
    exchangedToken: undefined,
    maxExchangedAmount: 0,
    receivedToken: undefined,
    orderRequestPage: 'confirmation-page',
    requestedTokenToExchange: undefined,
    requestedAmountToExchange: 0,
    requestedTokenToReceive: undefined,
    requestedAmountToReceive: 0
  },
  {
    [setExchangedToken]: (state, action) => {
      state.exchangedToken = action.payload
    },
    [setMaxExchangedAmount]: (state, action) => {
      state.maxExchangedAmount = action.payload
    },
    [setReceivedToken]: (state, action) => {
      state.receivedToken = action.payload
    },
    [setOrderRequestPage]: (state, action) => {
      state.orderRequestPage = action.payload
    },
    [setRequestedTokenToExchange]: (state, action) => {
      state.requestedTokenToExchange = action.payload
    },
    [setRequestedTokenToReceive]: (state, action) => {
      state.requestedTokenToReceive = action.payload
    }
  }
)
