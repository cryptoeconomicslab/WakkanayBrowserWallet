import { utils } from 'ethers'
import JSBI from 'jsbi'
import { Address } from '@cryptoeconomicslab/primitives'
import { createAction, createReducer } from '@reduxjs/toolkit'
import { getL1Balance } from './l1Balance'
import { getL2Balance } from './l2Balance'
import { getPendingExitList } from './pendingExitList'
import { pushToast } from './toast'
import { getTransactionHistories } from './transactionHistory'
import clientWrapper from '../client'
import { PETHContract } from '../contracts/'
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
      dispatch(getPendingExitList())
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
      await client.completeWithdrawal(exit, Address.from(client.address))
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
