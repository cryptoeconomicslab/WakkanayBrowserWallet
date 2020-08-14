import { createAction, createReducer } from '@reduxjs/toolkit'

export const pushRouteHistory = createAction('ADD_ROUTE_HISTORY')
export const popRouteHistory = createAction('POP_ROUTE_HISTORY')

export const appRouterReducer = createReducer(
  {
    routeHistory: []
  },
  {
    [pushRouteHistory]: (state, action) => {
      if (
        state.routeHistory.length > 0 &&
        state.routeHistory[state.routeHistory.length - 1] === action.payload
      ) {
        return
      }
      state.routeHistory = [...state.routeHistory, action.payload]
    },
    [popRouteHistory]: state => {
      state.routeHistory = state.routeHistory.filter(
        (h, i) => i !== state.routeHistory.length - 1
      )
    }
  }
)
