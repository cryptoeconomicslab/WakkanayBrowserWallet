import React from 'react'
import { useRouter } from 'next/router'
import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'

const Layout = ({ children }) => {
  const router = useRouter()
  const isDepositModalOpen = router.query.modal === 'deposit'
  const isWithdrawModalOpen = router.query.modal === 'withdraw'
  return (
    <>
      {children}
      {isDepositModalOpen && <DepositModal />}
      {isWithdrawModalOpen && <WithdrawModal />}
    </>
  )
}

export default Layout
