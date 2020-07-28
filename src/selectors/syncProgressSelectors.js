import { createSelector } from 'reselect'
import { roundBalance } from '../utils'

const getCurrentBlockNumber = state =>
  state.plasmaBlockNumber.currentBlockNumber
const getSyncingBlockNumber = state => state.appStatus.syncingBlockNumber

export const getSyncProgress = createSelector(
  [getCurrentBlockNumber, getSyncingBlockNumber],
  (currentBlockNumber, syncingBlockNumber) => {
    return roundBalance(syncingBlockNumber / currentBlockNumber) * 100
  }
)
