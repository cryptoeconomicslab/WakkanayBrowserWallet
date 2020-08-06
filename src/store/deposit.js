import { createAction, createReducer } from '@reduxjs/toolkit'
import clientWrapper from '../client'
import { utils } from 'ethers'
import JSBI from 'jsbi'
import { PETHContract } from '../contracts'
import { TOKEN_LIST } from '../constants/tokens'

export const DEPOSIT_PROGRESS = {
  INPUT: 'INPUT',
  CONFIRM: 'CONFIRM',
  COMPLETE: 'COMPLETE',
  ERROR: 'ERROR'
}

export const setDepositProgress = createAction('SET_DEPOSIT_PROGRESS')
export const setDepositError = createAction('SET_DEPOSIT_ERROR')

export const depositReducer = createReducer(
  {
    depositProgress: DEPOSIT_PROGRESS.INPUT,
    error: null
  },
  {
    [setDepositProgress]: (state, action) => {
      state.depositProgress = action.payload
    },
    [setDepositError]: (state, action) => {
      state.error = action.payload
      state.status = DEPOSIT_PROGRESS.ERROR
    }
  }
)

/**
 * deposit
 * @param {*} amount formatted ether string. e.g. "0.1"
 * @param {*} addr deposit contract address
 */
export const deposit = (amount, addr) => {
  return async dispatch => {
    try {
      const amountWei = JSBI.BigInt(utils.parseEther(amount).toString())
      const client = await clientWrapper.getClient()
      if (!client) return
      const peth = TOKEN_LIST.find(token => token.unit === 'ETH')
      if (peth !== undefined && addr === peth.tokenContractAddress) {
        const contract = new PETHContract(
          peth.tokenContractAddress,
          client.wallet.provider.getSigner()
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
