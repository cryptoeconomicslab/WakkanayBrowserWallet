import React from 'react'
import { connect } from 'react-redux'
import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import DepositWithdrawModal from './Base/DepositWithdrawModal'
import { BalanceList } from '../types/Balance'
import { AppState } from '../store'
import { deposit, setDepositProgress } from '../store/deposit'

interface Props {
  balanceList: BalanceList
  progress: string
  deposit: (amount: string, addr: string) => Promise<void>
  setProgress: ActionCreatorWithPayload<string, string>
}

const DepositModal = ({
  balanceList,
  progress,
  deposit,
  setProgress
}: Props) => {
  return (
    <DepositWithdrawModal
      type={'deposit'}
      action={deposit}
      progress={progress}
      setProgress={setProgress}
      balance={balanceList}
    />
  )
}

const mapStateToProps = ({
  l1Balance: { balanceList },
  depositState: { depositProgress }
}: AppState) => ({
  balanceList,
  progress: depositProgress
})
const mapDispatchToProps = {
  deposit,
  setProgress: setDepositProgress
}
export default connect(mapStateToProps, mapDispatchToProps)(DepositModal)
