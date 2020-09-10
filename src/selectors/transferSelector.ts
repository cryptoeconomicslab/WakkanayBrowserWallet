import { createSelector } from 'reselect'
import { TRANSFER_PROGRESS } from '../store/transfer'
import { STATE_LOADING_STATUS } from '../store/types'

const getTransferState = state => state.transferState.state
const getTransferredToken = state => state.transferState.transferredToken
const getTransferredAmount = state => state.transferState.transferredAmount
const getRecepientAddress = state => state.transferState.recepientAddress
const getSyncingStatus = state => state.appStatus.syncingStatus

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
