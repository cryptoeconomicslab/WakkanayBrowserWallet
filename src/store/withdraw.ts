import { createAction, createReducer } from '@reduxjs/toolkit'
import { utils } from 'ethers'
import JSBI from 'jsbi'
import { Exit } from '@cryptoeconomicslab/plasma'
import { getL1Balance } from './l1Balance'
import { getL2Balance } from './l2Balance'
import { getPendingExitList } from './pendingExitList'
import { pushToast } from './toast'
import { getTransactionHistories } from './transactionHistory'
import clientWrapper from '../client'
import { PETHContract } from '../contracts/'
import { getTokenByUnit, Token } from '../constants/tokens'
import { ActionType } from './types'

export enum WITHDRAW_ACTION_TYPES {
  SET_WITHDRAW_PROGRESS = 'SET_WITHDRAW_PROGRESS',
  SET_WITHDRAW_ERROR = 'SET_WITHDRAW_ERROR'
}

export const WITHDRAW_PROGRESS = {
  INPUT: 'INPUT',
  CONFIRM: 'CONFIRM',
  COMPLETE: 'COMPLETE',
  ERROR: 'ERROR'
}

export interface State {
  status: string
  error: Error | null
}

const initialState: State = {
  status: WITHDRAW_PROGRESS.INPUT,
  error: null
}

export const setWithdrawProgress = createAction<string>(
  WITHDRAW_ACTION_TYPES.SET_WITHDRAW_PROGRESS
)
export const setWithdrawError = createAction<Error>(
  WITHDRAW_ACTION_TYPES.SET_WITHDRAW_ERROR
)

const reducer = createReducer(initialState, {
  [setWithdrawProgress.type]: (
    state: State,
    action: ActionType<WITHDRAW_ACTION_TYPES>
  ) => {
    state.status = action.payload
  },
  [setWithdrawError.type]: (
    state: State,
    action: ActionType<WITHDRAW_ACTION_TYPES>
  ) => {
    state.error = action.payload
    state.status = WITHDRAW_PROGRESS.ERROR
  }
})

export default reducer

/**
 * withdraw token
 * @param {*} amount amount of wei to exit
 * @param {*} tokenContractAddress token contract address of token
 */
export const withdraw = (amount: string, tokenContractAddress: string) => {
  return async dispatch => {
    try {
      const amountWei = JSBI.BigInt(utils.parseEther(amount).toString())
      const client = clientWrapper.client
      if (!client) return
      await client.startWithdrawal(amountWei, tokenContractAddress)
      dispatch(setWithdrawProgress(WITHDRAW_PROGRESS.COMPLETE))
      dispatch(getL1Balance())
      dispatch(getL2Balance())
      dispatch(getTransactionHistories())
      dispatch(getPendingExitList())
    } catch (e) {
      console.error(e)
      dispatch(setWithdrawError(e))
    }
  }
}

export const completeWithdrawal = (exit: Exit) => {
  return async dispatch => {
    const client = clientWrapper.client
    const wallet = clientWrapper.wallet
    if (!client || !wallet) return
    try {
      await client.completeWithdrawal(exit)
      // TODO: must wait until that tx is included
      const peth = getTokenByUnit('ETH') as Token
      if (
        peth.depositContractAddress.toLowerCase() ===
        exit.stateUpdate.depositContractAddress.data
      ) {
        const contract = new PETHContract(
          peth.tokenContractAddress,
          wallet.provider.getSigner()
        )
        await contract.unwrap(exit.stateUpdate.amount)
      }
      dispatch(getL1Balance())
      dispatch(getL2Balance())
      dispatch(getTransactionHistories())
      dispatch(getPendingExitList())
      dispatch(
        pushToast({
          message: 'Complete withdrawal transaction submitted.',
          type: 'info'
        })
      )
    } catch (e) {
      console.error(e)
      dispatch(pushToast({ message: e.message, type: 'error' }))
    }
  }
}
