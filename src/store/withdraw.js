import { createAction, createReducer } from '@reduxjs/toolkit'
import { utils } from 'ethers'
import JSBI from 'jsbi'
import { getL1Balance } from './l1Balance'
import { getL2Balance } from './l2Balance'
import { getTransactionHistories } from './transactionHistory'
import clientWrapper from '../client'
import { PETHContract } from '../contracts/PETHContract'
import { getTokenByUnit } from '../constants/tokens'

export const WITHDRAW_PROGRESS = {
  INPUT: 'INPUT',
  CONFIRM: 'CONFIRM',
  COMPLETE: 'COMPLETE',
  ERROR: 'ERROR'
}

export const setWithdrawProgress = createAction('SET_WITHDRAW_PROGRESS')
export const setWithdrawError = createAction('SET_WITHDRAW_ERROR')

export const withdrawReducer = createReducer(
  {
    status: WITHDRAW_PROGRESS.INPUT,
    error: null
  },
  {
    [setWithdrawProgress]: (state, action) => {
      state.status = action.payload
    },
    [setWithdrawError]: (state, action) => {
      state.error = action.payload
      state.status = WITHDRAW_PROGRESS.ERROR
    }
  }
)

/**
 * withdraw token
 * @param {*} amount amount of wei to exit
 * @param {*} tokenContractAddress token contract address of token
 */
export const withdraw = (amount, tokenContractAddress) => {
  return async dispatch => {
    try {
      const amountWei = JSBI.BigInt(utils.parseEther(amount).toString())
      const client = await clientWrapper.getClient()
      if (!client) return
      await client.startWithdrawal(amountWei, tokenContractAddress)
      dispatch(setWithdrawProgress(WITHDRAW_PROGRESS.COMPLETE))
      dispatch(getL1Balance())
      dispatch(getL2Balance())
      dispatch(getTransactionHistories())
    } catch (e) {
      console.error(e)
      dispatch(setWithdrawError(e))
    }
  }
}

export const completeWithdrawal = exit => {
  return async dispatch => {
    const client = await clientWrapper.getClient()
    if (!client) return
    try {
      await client.completeWithdrawal(exit)
      // TODO: must wait until that tx is included
      const peth = getTokenByUnit('ETH')
      if (
        peth.depositContractAddress.toLowerCase() ===
        exit.stateUpdate.depositContractAddress.data
      ) {
        const contract = new PETHContract(
          peth.tokenContractAddress,
          client.wallet.provider.getSigner()
        )
        await contract.unwrap(exit.stateUpdate.amount)
      }
      dispatch({
        type: `NOTIFY_FINALIZE_EXIT`,
        payload: exit.id.toHexString()
      })
    } catch (e) {
      // @NOTE: 'Exit property is not decidable' is fine
      if (e.message === 'Exit property is not decidable') return
      console.error(e)

      // TODO: add toast after merge #154
      // dispatch(
      //   pushToast({ message: e.message, type: 'error' })
      // )
    }
  }
}
