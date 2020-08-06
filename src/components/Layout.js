import { useRouter } from 'next/router'
import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'
import OrderRequestModal from './OrderRequestModal'

export default ({ children }) => {
  const router = useRouter()
  const isDepositModalOpen = router.query.modal === 'deposit'
  const isWithdrawModalOpen = router.query.modal === 'withdraw'
  const isOrderRequestModalOpen = router.query.modal === 'orderRequest'
  return (
    <>
      {children}
      {isDepositModalOpen && <DepositModal />}
      {isWithdrawModalOpen && <WithdrawModal />}
      {isOrderRequestModalOpen && <OrderRequestModal />}
    </>
  )
}
