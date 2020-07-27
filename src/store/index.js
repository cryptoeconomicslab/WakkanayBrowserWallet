import { combineReducers, createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'

import { addressReducer } from './address'
import { ethUsdRateReducer } from './ethUsdRate'
import { l1BalanceReducer } from './l1Balance'
import { l2BalanceReducer } from './l2Balance'
import { addressListReducer } from './address_list_item'
import { editedAddressListItemReducer } from './edited_address_list_item.js'
import { historyReducer } from './transactionHistory'
import { depositReducer } from './deposit'
import { transferReducer } from './transfer'
import { withdrawReducer } from './withdraw'
import { appStatusReducer } from './appStatus'
import { appRouterReducer } from './appRouter'
import { exchangeReducer } from './exchange'
import { errorReducer } from './error'

const reducer = combineReducers({
  address: addressReducer,
  l1Balance: l1BalanceReducer,
  l2Balance: l2BalanceReducer,
  ethUsdRate: ethUsdRateReducer,
  addressList: addressListReducer,
  editedAddressListItem: editedAddressListItemReducer,
  history: historyReducer,
  depositState: depositReducer,
  transferState: transferReducer,
  withdrawState: withdrawReducer,
  appStatus: appStatusReducer,
  appRouter: appRouterReducer,
  exchangeState: exchangeReducer,
  errorState: errorReducer
})

export const initStore = initialState => {
  return createStore(reducer, initialState, applyMiddleware(logger, thunk))
}
