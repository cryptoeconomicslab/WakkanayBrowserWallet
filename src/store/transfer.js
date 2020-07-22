import { createAction, createReducer } from '@reduxjs/toolkit'
import { createSelector } from 'reselect'
import { utils } from 'ethers'
import JSBI from 'jsbi'
import clientWrapper from '../client'
import { config } from '../config'

export const setTransferIsSending = createAction('SET_TRANSFER_IS_SENDING')
export const setTransferredToken = createAction('SET_TRANSFERRED_TOKEN')
export const setTransferredAmount = createAction('SET_TRANSFERRED_AMOUNT')
export const setRecepientAddress = createAction('SET_RECEPIENT_ADDRESS')
export const setTransferPage = createAction('SET_TRANSFER_PAGE')
export const setTransferError = createAction('SET_TRANSFER_ERROR')
export const clearTransferState = createAction('CLEAR_TRANSFER_STATE')

const initialState = {
  isSending: false,
  transferredToken: config.PlasmaETH,
  transferredAmount: '',
  recepientAddress: '',
  transferPage: 'confirmation-page',
  transferError: false
}
export const transferReducer = createReducer(initialState, {
  [setTransferIsSending]: (state, action) => {
    state.isSending = action.payload
  },
  [setTransferredToken]: (state, action) => {
    state.transferredToken = action.payload
  },
  [setTransferredAmount]: (state, action) => {
    state.transferredAmount = action.payload
  },
  [setRecepientAddress]: (state, action) => {
    state.recepientAddress = action.payload
  },
  [setTransferPage]: (state, action) => {
    state.transferPage = action.payload
  },
  [setTransferError]: (state, action) => {
    state.transferError = action.payload
  },
  [clearTransferState]: () => {
    return initialState
  }
})

/**
 * transfer token
 * @param {*} amount amount of wei
 * @param {*} tokenContractAddress token contract address of token
 * @param {*} recipientAddress the address of token recipient
 */
export const transfer = (amount, tokenContractAddress, recipientAddress) => {
  // TODO: validation check
  // invalid address, insufficient funds
  return async dispatch => {
    try {
      dispatch(setTransferError(false))
      dispatch(setTransferIsSending(true))
      const client = await clientWrapper.getClient()
      if (!client) return
      const amountWei = JSBI.BigInt(utils.parseEther(amount).toString())
      await client.transfer(amountWei, tokenContractAddress, recipientAddress)
      dispatch(clearTransferState())
      dispatch(setTransferPage('completion-page'))
    } catch (error) {
      console.error(error)
      dispatch(setTransferError(true))
    } finally {
      dispatch(setTransferIsSending(false))
    }
  }
}

// selector
const getTransferIsSending = state => state.transferState.isSending
const getTransferredToken = state => state.transferState.transferredToken
const getTransferredAmount = state => state.transferState.transferredAmount
const getRecepientAddress = state => state.transferState.recepientAddress
export const isAbleToSubmit = createSelector(
  [
    getTransferIsSending,
    getTransferredToken,
    getTransferredAmount,
    getRecepientAddress
  ],
  (isSending, token, amount, address) => {
    return isSending === true || !token || !amount || !address
  }
)
