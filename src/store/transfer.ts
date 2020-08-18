import { Dispatch } from 'redux'
import { createAction, createReducer } from '@reduxjs/toolkit'
import { utils } from 'ethers'
import JSBI from 'jsbi'
import { pushToast } from './toast'
import { TRANSACTION_HISTORY_PROGRESS } from './transactionHistory'
import clientWrapper from '../client'
import { config } from '../config'
import validateTransfer from '../validators/transferValidator'

export enum TRANSFER_ACTION_TYPES {
  SET_TRANSFER_IS_SENDING = 'SET_TRANSFER_IS_SENDING',
  SET_TRANSFERRED_TOKEN = 'SET_TRANSFERRED_TOKEN',
  SET_TRANSFERRED_AMOUNT = 'SET_TRANSFERRED_AMOUNT',
  SET_RECEPIENT_ADDRESS = 'SET_RECEPIENT_ADDRESS',
  SET_TRANSFER_PAGE = 'SET_TRANSFER_PAGE',
  SET_TRANSFER_STATUS = 'SET_TRANSFER_STATUS',
  SET_TRANSFER_ERROR = 'SET_TRANSFER_ERROR',
  CLEAR_TRANSFER_STATE = 'CLEAR_TRANSFER_STATE'
}

export const TRANSFER_PROGRESS = {
  INITIAL: 'INITIAL',
  SENDING: 'SENDING',
  COMPLETE: 'COMPLETE',
  ERROR: 'ERROR'
}

export interface State {
  transferredToken: string
  transferredAmount: string
  recepientAddress: string
  transferPage: string
  status: string
  error: Error | null
}

const initialState: State = {
  transferredToken: config.PlasmaETH,
  transferredAmount: '',
  recepientAddress: '',
  transferPage: 'confirmation-page',
  status: TRANSFER_PROGRESS.INITIAL,
  error: null
}

interface TransferAction {
  type: TRANSFER_ACTION_TYPES
  payload?: any
  error?: boolean
}

export const setTransferIsSending = createAction<string>(
  TRANSFER_ACTION_TYPES.SET_TRANSFER_IS_SENDING
)
export const setTransferredToken = createAction<string>(
  TRANSFER_ACTION_TYPES.SET_TRANSFERRED_TOKEN
)
export const setTransferredAmount = createAction<string>(
  TRANSFER_ACTION_TYPES.SET_TRANSFERRED_AMOUNT
)
export const setRecepientAddress = createAction<string>(
  TRANSFER_ACTION_TYPES.SET_RECEPIENT_ADDRESS
)
export const setTransferPage = createAction<string>(
  TRANSFER_ACTION_TYPES.SET_TRANSFER_PAGE
)
export const setTransferStatus = createAction<string>(
  TRANSFER_ACTION_TYPES.SET_TRANSFER_STATUS
)
export const setTransferError = createAction<Error>(
  TRANSFER_ACTION_TYPES.SET_TRANSFER_ERROR
)
export const clearTransferState = createAction(
  TRANSFER_ACTION_TYPES.CLEAR_TRANSFER_STATE
)

const reducer = createReducer(initialState, {
  [setTransferredToken.type]: (state: State, action: TransferAction) => {
    state.transferredToken = action.payload
  },
  [setTransferredAmount.type]: (state: State, action: TransferAction) => {
    state.transferredAmount = action.payload
  },
  [setRecepientAddress.type]: (state: State, action: TransferAction) => {
    state.recepientAddress = action.payload
  },
  [setTransferPage.type]: (state: State, action: TransferAction) => {
    state.transferPage = action.payload
  },
  [setTransferStatus.type]: (state: State, action: TransferAction) => {
    state.status = action.payload
  },
  [setTransferError.type]: (state: State, action: TransferAction) => {
    state.error = action.payload
    state.status = TRANSACTION_HISTORY_PROGRESS.ERROR
  },
  [clearTransferState.type]: () => {
    return initialState
  }
})

export default reducer

/**
 * transfer token
 * @param {*} amount amount of wei
 * @param {*} tokenContractAddress token contract address of token
 * @param {*} recipientAddress the address of token recipient
 */
export const transfer = (
  amount: string,
  tokenContractAddress: string,
  recipientAddress: string
) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(setTransferStatus(TRANSFER_PROGRESS.SENDING))
      const client = clientWrapper.getClient()
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
