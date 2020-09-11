import { createSelector } from 'reselect'
import { AppState } from './../store'
import { TRANSFER_PROGRESS } from '../store/transfer'
import { STATE_LOADING_STATUS } from '../store/types'

const getTransferState = (state: AppState) => state.transferState.status
const getTransferredToken = (state: AppState) =>
  state.transferState.transferredToken
const getTransferredAmount = (state: AppState) =>
  state.transferState.transferredAmount
const getRecepientAddress = (state: AppState) =>
  state.transferState.recepientAddress
const getSyncingStatus = (state: AppState) => state.appStatus.syncingStatus

export const isAbleToTransfer = createSelector(
  [
    getTransferState,
    getTransferredToken,
    getTransferredAmount,
    getRecepientAddress,
    getSyncingStatus
  ],
  (state, token, amount, address, syncingStatus) => {
    return (
      state === TRANSFER_PROGRESS.SENDING ||
      syncingStatus === STATE_LOADING_STATUS.LOADING ||
      !token ||
      !amount ||
      !address
    )
  }
)
