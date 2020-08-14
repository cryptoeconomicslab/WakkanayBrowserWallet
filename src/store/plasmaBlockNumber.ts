import { createAction, createReducer } from '@reduxjs/toolkit'
import clientWrapper from '../client'
import { config } from '../config'
import { CommitmentContract } from '../contracts'

export const setCurrentBlockNumber = createAction('SET_CURRENT_BLOCK_NUMBER')

export const plasmaBlockNumberReducer = createReducer(
  {
    currentBlockNumber: 0
  },
  {
    [setCurrentBlockNumber]: (state, action) => {
      state.currentBlockNumber = action.payload
    }
  }
)

export const getCurrentBlockNumber = () => {
  return async dispatch => {
    try {
      const client = await clientWrapper.getClient()
      if (!client) return
      const contract = new CommitmentContract(
        config.commitment,
        client.wallet.provider.getSigner()
      )
      const currentBlockNumber = await contract.getCurrentBlockNumber()
      dispatch(setCurrentBlockNumber(currentBlockNumber))
    } catch (e) {
      console.error(e)
      // TODO: WAK-449 flux standard action
    }
  }
}
