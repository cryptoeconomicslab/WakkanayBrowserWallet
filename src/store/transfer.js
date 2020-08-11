import { createAction, createReducer } from '@reduxjs/toolkit'
import { utils } from 'ethers'
import JSBI from 'jsbi'
import { pushToast } from './toast'
import { TRANSACTION_HISTORY_PROGRESS } from './transactionHistory'
import clientWrapper from '../client'
import { config } from '../config'
import validateTransfer from '../validators/transferValidator'

export const TRANSFER_PROGRESS = {
  INITIAL: 'INITIAL',
  SENDING: 'SENDING',
  COMPLETE: 'COMPLETE',
  ERROR: 'ERROR'
}

export const setTransferIsSending = createAction('SET_TRANSFER_IS_SENDING')
export const setTransferredToken = createAction('SET_TRANSFERRED_TOKEN')
export const setTransferredAmount = createAction('SET_TRANSFERRED_AMOUNT')
export const setRecepientAddress = createAction('SET_RECEPIENT_ADDRESS')
export const setTransferPage = createAction('SET_TRANSFER_PAGE')
export const setTransferStatus = createAction('SET_TRANSFER_STATUS')
export const setTransferError = createAction('SET_TRANSFER_ERROR')
export const clearTransferState = createAction('CLEAR_TRANSFER_STATE')

const initialState = {
  transferredToken: config.PlasmaETH,
  transferredAmount: '',
  recepientAddress: '',
  transferPage: 'confirmation-page',
  status: TRANSFER_PROGRESS.INITIAL,
  error: null
}
export const transferReducer = createReducer(initialState, {
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
  [setTransferStatus]: (state, action) => {
    state.status = action.payload
  },
  [setTransferError]: (state, action) => {
    state.error = action.payload
    state.status = TRANSACTION_HISTORY_PROGRESS.ERROR
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
  return async dispatch => {
    try {
      dispatch(setTransferStatus(TRANSFER_PROGRESS.SENDING))
      const client = await clientWrapper.getClient()
      if (!client) {
        throw Error('Client is not ready.')
      }

      // validation check
      const amountWei = JSBI.BigInt(utils.parseEther(amount).toString())
      const errors = await validateTransfer(
        client,
        amountWei,
        tokenContractAddress,
        recipientAddress
      )
      if (errors.length > 0) {
        errors.map(error =>
          dispatch(pushToast({ message: error, type: 'error' }))
        )
        dispatch(setTransferStatus(TRANSFER_PROGRESS.ERROR))
        return
      }

      // transfer
      await client.transfer(amountWei, tokenContractAddress, recipientAddress)
      dispatch(clearTransferState())
      dispatch(setTransferPage('completion-page'))
      dispatch(setTransferStatus(TRANSFER_PROGRESS.COMPLETE))
      dispatch(pushToast({ message: 'Transfer success.', type: 'info' }))
    } catch (e) {
      console.error(e)
      dispatch(setTransferError(e))
      dispatch(pushToast({ message: 'Transfer failed.', type: 'error' }))
    }
  }
}
