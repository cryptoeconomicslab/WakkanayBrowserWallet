import { Dispatch } from 'redux'
import { createAction, createReducer } from '@reduxjs/toolkit'
import clientWrapper from '../client'

export enum GET_ADDRESS_ACTION_TYPES {
  SET_USER_ADDRESS = 'SET_USER_ADDRESS'
}

export interface State {
  item: string
}

const initialState: State = {
  item: ''
}

interface AddressAction {
  type: GET_ADDRESS_ACTION_TYPES
  payload?: any
  error?: boolean
}

export const setUserAddress = createAction<string>(
  GET_ADDRESS_ACTION_TYPES.SET_USER_ADDRESS
)

const reducer = createReducer(initialState, {
  [setUserAddress.type]: (state: State, action: AddressAction) => {
    state.item = action.payload
  }
})

export default reducer

export const getAddress = () => {
  return (dispatch: Dispatch) => {
    const client = clientWrapper.getClient()
    if (!client) return
    const address = client.address
    dispatch(setUserAddress(address))
  }
}
