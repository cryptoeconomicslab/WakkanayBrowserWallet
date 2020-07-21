import React from 'react'
import { connect } from 'react-redux'
import DepositWithdrawModal from './Base/DepositWithdrawModal'
import { deposit, setDepositProgress } from '../store/deposit'

const DepositModal = ({ deposit, progress, setProgress, l1Balance }) => {
  return (
    <DepositWithdrawModal
      type={'deposit'}
      action={deposit}
      progress={progress}
      setProgress={setProgress}
      balance={l1Balance}
    />
  )
}

const mapStateToProps = ({
  tokenBalance: { l1Balance },
  depositState: { depositProgress }
}) => ({
  l1Balance,
  progress: depositProgress
})
const mapDispatchToProps = {
  deposit,
  setProgress: setDepositProgress
}
export default connect(mapStateToProps, mapDispatchToProps)(DepositModal)
