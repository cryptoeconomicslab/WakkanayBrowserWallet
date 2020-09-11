import {
  combineReducers,
  createStore,
  applyMiddleware,
  AnyAction,
  CombinedState
} from 'redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import address, { State as AddressState } from './address'
import appStatus, { State as AppStatusState } from './appStatus'
import appRouter, { State as AppRouterState } from './appRouter'
import deposit, { State as DepositState } from './deposit'
import ethUsdRate, { State as EthUsdState } from './ethUsdRate'
import l1Balance, { State as L1BalanceState } from './l1Balance'
import l2Balance, { State as L2BalanceState } from './l2Balance'
import { userLogout } from './logout'
import history, { State as HistoryState } from './transactionHistory'
import pendingExitList, {
  State as PendingExitListState
} from './pendingExitList'
import toast, { State as ToastState } from './toast'
import transfer, { State as TransferState } from './transfer'
import withdraw, { State as WithdrawState } from './withdraw'

export interface AppState {
  address: AddressState
  appStatus: AppStatusState
  appRouter: AppRouterState
  depositState: DepositState
  ethUsdRate: EthUsdState
  history: HistoryState
  pendingExitList: PendingExitListState
  l1Balance: L1BalanceState
  l2Balance: L2BalanceState
  toast: ToastState
  transferState: TransferState
  withdrawState: WithdrawState
}

const appReducer = combineReducers({
  address,
  appStatus,
  appRouter,
  depositState: deposit,
  ethUsdRate,
  l1Balance,
  l2Balance,
  history,
  pendingExitList,
  toast,
  transferState: transfer,
  withdrawState: withdraw
})

const rootReducer = (
  state: AppState | undefined,
  action: AnyAction
): CombinedState<AppState> => {
  if (action.type === userLogout.type) {
    state = undefined
  }
  return appReducer(state, action)
}

export default rootReducer

export const makeStore = initialState => {
  return createStore(rootReducer, initialState, applyMiddleware(thunk, logger))
}
