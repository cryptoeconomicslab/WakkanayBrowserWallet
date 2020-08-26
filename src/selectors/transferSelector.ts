import { createSelector } from 'reselect'
import { SYNCING_STATUS } from '../store/appStatus'
import { TRANSFER_PROGRESS } from '../store/transfer'

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
      syncingStatus === SYNCING_STATUS.LOADING ||
      !token ||
      !amount ||
      !address
    )
  }
)
