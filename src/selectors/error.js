import { createSelector } from 'reselect'

// selector
const getErrorEthToUSD = state => state.tokenBalance.errorEthToUSD
const getErrorL1Balance = state => state.tokenBalance.errorL1Balance
const getErrorTokenBalance = state => state.tokenBalance.errorTokenBalance
const getErrorHistoryList = state => state.history.errorHistoryList
const getErrorAppStatus = state => state.appStatus.error
const getErrorTransfer = state => state.transferState.transferError

export const getErrorMessage = createSelector(
  [
    getErrorEthToUSD,
    getErrorL1Balance,
    getErrorTokenBalance,
    getErrorHistoryList,
    getErrorAppStatus,
    getErrorTransfer
  ],
  (
    errorEthToUSD,
    errorL1Balance,
    errorTokenBalance,
    errorHistoryList,
    errorAppStatus,
    errorTransfer
  ) => {
    if (errorEthToUSD) {
      return 'Can not get USD balance now.'
    } else if (errorL1Balance || errorTokenBalance) {
      return 'Can not get your balance now.'
    } else if (errorHistoryList) {
      return 'Can not get your transaction history now.'
    } else if (errorAppStatus) {
      return errorAppStatus.message
    } else if (errorTransfer) {
      return errorTransfer
    }
  }
)
