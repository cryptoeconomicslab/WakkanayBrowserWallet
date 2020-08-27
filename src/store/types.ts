export interface ActionType<T> {
  type: T
  payload?: any
  error?: boolean
}
