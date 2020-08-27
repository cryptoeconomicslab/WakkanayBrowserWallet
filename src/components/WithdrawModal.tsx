import React from 'react'
import { connect } from 'react-redux'
import { withdraw, setWithdrawProgress } from '../store/withdraw'
import DepositWithdrawModal from './Base/DepositWithdrawModal'

const WithdrawModal = ({ balanceList, progress, withdraw, setProgress }) => {
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
}) => ({
  balanceList,
  progress: status
})
const mapDispatchToProps = {
  withdraw,
  setProgress: setWithdrawProgress
}
export default connect(mapStateToProps, mapDispatchToProps)(WithdrawModal)
