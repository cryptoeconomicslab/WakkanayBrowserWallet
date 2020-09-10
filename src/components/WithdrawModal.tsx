import React from 'react'
import { connect } from 'react-redux'
import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import { AppState } from '../store'
import { withdraw, setWithdrawProgress } from '../store/withdraw'
import { BalanceList } from '../types/Balance'
import DepositWithdrawModal from './Base/DepositWithdrawModal'

interface Props {
  balanceList: BalanceList
  progress: string
  withdraw: (amount: string, addr: string) => Promise<void>
  setProgress: ActionCreatorWithPayload<string, string>
}

const WithdrawModal = ({
  balanceList,
  progress,
  withdraw,
  setProgress
}: Props) => {
  return (
    <DepositWithdrawModal
      type={'withdraw'}
      action={withdraw}
      progress={progress}
      setProgress={setProgress}
      balance={balanceList}
    />
  )
}

const mapStateToProps = ({
  l2Balance: { balanceList },
  withdrawState: { status }
}: AppState) => ({
  balanceList,
  progress: status
})
const mapDispatchToProps = {
  withdraw,
  setProgress: setWithdrawProgress
}
export default connect(mapStateToProps, mapDispatchToProps)(WithdrawModal)
