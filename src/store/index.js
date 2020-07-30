import { combineReducers, createStore, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'

import { addressReducer } from './address'
import { tokenBalanceReducer } from './tokenBalanceList'
import { addressListReducer } from './address_list_item'
import { editedAddressListItemReducer } from './edited_address_list_item.js'
import { historyReducer } from './transaction_history'
import { depositReducer } from './deposit'
import { transferReducer } from './transfer'
import { withdrawReducer } from './withdraw'
import { appStatusReducer } from './appStatus'
import { appRouterReducer } from './appRouter'
import { exchangeReducer } from './exchange'
import { errorReducer } from './error'
import { pendingExitListReducer } from './pendingExitList'

const reducer = combineReducers({
  address: addressReducer,
  tokenBalance: tokenBalanceReducer,
  addressList: addressListReducer,
  editedAddressListItem: editedAddressListItemReducer,
  history: historyReducer,
  depositState: depositReducer,
  transferState: transferReducer,
  withdrawState: withdrawReducer,
  appStatus: appStatusReducer,
  appRouter: appRouterReducer,
  exchangeState: exchangeReducer,
  errorState: errorReducer,
  pendingExitList: pendingExitListReducer
})

export const initStore = initialState => {
  return createStore(reducer, initialState, applyMiddleware(logger, thunk))
}
