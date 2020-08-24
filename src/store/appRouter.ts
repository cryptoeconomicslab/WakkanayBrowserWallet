import { createAction, createReducer } from '@reduxjs/toolkit'
import { ActionType } from './types'

export enum APP_ROUTER_ACTION_TYPES {
  ADD_ROUTE_HISTORY = 'ADD_ROUTE_HISTORY',
  POP_ROUTE_HISTORY = 'POP_ROUTE_HISTORY'
}

export interface State {
  routeHistory: string[]
}

const initialState: State = {
  routeHistory: []
}

export const pushRouteHistory = createAction<string>(
  APP_ROUTER_ACTION_TYPES.ADD_ROUTE_HISTORY
)
export const popRouteHistory = createAction(
  APP_ROUTER_ACTION_TYPES.POP_ROUTE_HISTORY
)

const reducer = createReducer(initialState, {
  [pushRouteHistory.type]: (
    state: State,
    action: ActionType<APP_ROUTER_ACTION_TYPES>
  ) => {
    if (
      state.routeHistory.length > 0 &&
      state.routeHistory[state.routeHistory.length - 1] === action.payload
    ) {
      return
    }
    state.routeHistory = [...state.routeHistory, action.payload]
  },
  [popRouteHistory.type]: (state: State) => {
    state.routeHistory = state.routeHistory.filter(
      (h, i) => i !== state.routeHistory.length - 1
    )
  }
})

export default reducer
