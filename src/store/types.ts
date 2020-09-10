export interface ActionType<T> {
  type: T
  payload?: any
  error?: boolean
}

export enum STATE_LOADING_STATUS {
  UNLOADED = 'UNLOADED',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
  ERROR = 'ERROR'
}

export enum DEPOSIT_WITHDRAW_PROGRESS {
  INPUT = 'INPUT',
  CONFIRM = 'CONFIRM',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}
