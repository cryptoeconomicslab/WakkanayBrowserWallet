import { createSelector } from 'reselect'
import { AppState } from './../store'
import { BalanceList } from '../types/Balance'
import { roundBalance } from '../utils'

// selector
const getL1Balance = (state: AppState) => state.l1Balance.balanceList
const getL2Balance = (state: AppState) => state.l2Balance.balanceList
const getEthUsdRate = (state: AppState) => state.ethUsdRate.rate

const calcTotalBalance = (balance: BalanceList, ethUsdRate: number) => {
  let total = 0
  for (const [key, value] of Object.entries(balance)) {
    if (key === 'ETH') {
      total += value.amount * ethUsdRate
    } else {
      total += value.amount
    }
  }
  return roundBalance(total)
}

export const getL1TotalBalance = createSelector(
  [getL1Balance, getEthUsdRate],
  (l1Balance, ethUsdRate) => {
    return calcTotalBalance(l1Balance, ethUsdRate)
  }
)

export const getL2TotalBalance = createSelector(
  [getL2Balance, getEthUsdRate],
  (l2Balance, ethUsdRate) => {
    return calcTotalBalance(l2Balance, ethUsdRate)
  }
)
