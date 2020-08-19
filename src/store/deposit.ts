import { Dispatch } from 'redux'
import { createAction, createReducer } from '@reduxjs/toolkit'
import { utils } from 'ethers'
import JSBI from 'jsbi'
import clientWrapper from '../client'
import { PETHContract } from '../contracts'
import { getTokenByUnit } from '../constants/tokens'

export enum DEPOSIT_ACTION_TYPES {
  SET_DEPOSIT_PROGRESS = 'SET_DEPOSIT_PROGRESS',
  SET_DEPOSIT_ERROR = 'SET_DEPOSIT_ERROR'
}

export const DEPOSIT_PROGRESS = {
  INPUT: 'INPUT',
  CONFIRM: 'CONFIRM',
  COMPLETE: 'COMPLETE',
  ERROR: 'ERROR'
}

export interface State {
  depositProgress: string
  error: Error | null
}

const initialState: State = {
  depositProgress: DEPOSIT_PROGRESS.INPUT,
  error: null
}

interface DepositAction {
  type: DEPOSIT_ACTION_TYPES
  payload?: any
  error?: boolean
}

export const setDepositProgress = createAction<string>(
  DEPOSIT_ACTION_TYPES.SET_DEPOSIT_PROGRESS
)

export const setDepositError = createAction<Error>(
  DEPOSIT_ACTION_TYPES.SET_DEPOSIT_ERROR
)

const reducer = createReducer(initialState, {
  [setDepositProgress.type]: (state: State, action: DepositAction) => {
    state.depositProgress = action.payload
  },
  [setDepositError.type]: (state: State, action: DepositAction) => {
    state.error = action.payload
    state.depositProgress = DEPOSIT_PROGRESS.ERROR
  }
})

export default reducer

/**
 * deposit
 * @param {*} amount formatted ether string. e.g. "0.1"
 * @param {*} addr deposit contract address
 */
export const deposit = (amount: string, addr: string) => {
  return async (dispatch: Dispatch) => {
    try {
      const amountWei = JSBI.BigInt(utils.parseEther(amount).toString())
      const client = clientWrapper.client
      const wallet = clientWrapper.wallet
      if (!client || !wallet) return
      const peth = getTokenByUnit('ETH')
      if (peth !== undefined && addr === peth.tokenContractAddress) {
        const contract = new PETHContract(
          peth.tokenContractAddress,
          wallet.provider.getSigner()
        )
        await contract.wrap(amountWei)
        console.info(`wrapped PETH: ${amount}`)
      }
      await client.deposit(amountWei, addr)
      dispatch(setDepositProgress(DEPOSIT_PROGRESS.COMPLETE))
    } catch (e) {
      console.error(e)
      dispatch(setDepositError(e))
    }
  }
}
