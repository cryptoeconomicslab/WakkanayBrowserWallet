import { createAction, createReducer } from '@reduxjs/toolkit'
import { utils } from 'ethers'
import JSBI from 'jsbi'
import { getBalance } from './tokenBalanceList'
import clientWrapper from '../client'

export const WITHDRAW_PROGRESS = {
  INPUT: 'INPUT',
  CONFIRM: 'CONFIRM',
  COMPLETE: 'COMPLETE',
  ERROR: 'ERROR'
}

export const setWithdrawProgress = createAction('SET_WITHDRAW_PROGRESS')

export const withdrawReducer = createReducer(
  {
    withdrawProgress: WITHDRAW_PROGRESS.INPUT
  },
  {
    [setWithdrawProgress]: (state, action) => {
      state.withdrawProgress = action.payload
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
      dispatch(getBalance())
    } catch (error) {
      console.error(error)
      dispatch(setWithdrawProgress(WITHDRAW_PROGRESS.ERROR))
    }
  }
}

export const completeWithdrawal = () => {
  return async dispatch => {
    const client = await clientWrapper.getClient()
    if (!client) return
    const exitList = await client.getPendingWithdrawals()
    exitList.map(async exit => {
      try {
        console.log(exit)
        await client.completeWithdrawal(exit)
        dispatch({
          type: `NOTIFY_FINALIZE_EXIT`,
          payload: exit.id.intoHexString()
        })
      } catch (e) {
        // @NOTE: 'Exit property is not decidable' is fine
        if (e.message === 'Exit property is not decidable') return
        console.error(e)
        return
      }
    })
  }
}
export const sleep = msec => new Promise(resolve => setTimeout(resolve, msec))

export const autoCompleteWithdrawal = async dispatch => {
  await sleep(20000)
  dispatch(completeWithdrawal())
  return await autoCompleteWithdrawal(dispatch)
}
