import { createAction, createReducer } from '@reduxjs/toolkit'
import { utils } from 'ethers'
import JSBI from 'jsbi'
import { getBalance, getL1Balance } from './tokenBalanceList'
import { getTransactionHistories } from './transaction_history'
import clientWrapper from '../client'
import { PETHContract } from '../contracts/PETHContract'
import { getTokenByUnit } from '../constants/tokens'

export const WITHDRAW_PROGRESS = {
  INPUT: 'INPUT',
  CONFIRM: 'CONFIRM',
  COMPLETE: 'COMPLETE'
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
  const amountWei = JSBI.BigInt(utils.parseEther(amount).toString())
  return async dispatch => {
    try {
      const client = await clientWrapper.getClient()
      if (!client) return
      await client.startWithdrawal(amountWei, tokenContractAddress)
      dispatch(setWithdrawProgress(WITHDRAW_PROGRESS.COMPLETE))
      dispatch(getBalance())
      dispatch(getL1Balance())
      dispatch(getTransactionHistories())
    } catch (error) {
      console.log(error)
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
