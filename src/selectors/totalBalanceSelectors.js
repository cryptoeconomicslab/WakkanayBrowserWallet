import { createSelector } from 'reselect'
import { roundBalance } from '../utils'

// selector
const getL1Balance = state => state.l1Balance.balanceList
const getL2Balance = state => state.l2Balance.balanceList
const getEthUsdRate = state => state.ethUsdRate.rate

const calcTotalBalance = (balance, ethUsdRate) => {
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
