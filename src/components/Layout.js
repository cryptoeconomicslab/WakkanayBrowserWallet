import Header from './Header'
import MainDisplay from './MainDisplay'
import Tabs from './Tabs'
import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'
import TransferModal from './TransferModal'
import { useRouter } from 'next/router'

const Layout = props => {
  const router = useRouter()
  const isDepositModalOpen = router.query.deposit !== undefined
  const isWithdrawModalOpen = router.query.withdraw !== undefined
  const isTransferModalOpen = router.query.transfer !== undefined
  return (
    <div>
      <div>
        <Header />
        <div className="back-ground">
          <div className="main-display-background">
            <Tabs />
            <MainDisplay>{props.children}</MainDisplay>
          </div>
        </div>
        <footer>
          <h4>Cryptoeconomics Lab Inc.</h4>
        </footer>
      </div>
      {isDepositModalOpen && <DepositModal />}
      {isWithdrawModalOpen && <WithdrawModal />}
      {isTransferModalOpen && <TransferModal />}
      <style>{`
        *,
        *:after,
        *:before {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          box-sizing: border-box;
          font-family: 'Avenir Next';
          ${isDepositModalOpen ? 'overflow: hidden;' : ''}
          ${isWithdrawModalOpen ? 'overflow: hidden;' : ''}
          ${isTransferModalOpen ? 'overflow: hidden;' : ''}
        }
        input {
          font-family: 'Avenir Next';
        }
      `}</style>
      <style jsx>{`
        .back-ground {
          display: flex;
          width: 1268px;
          border-right: none;
          margin: 0px 24px;
          border: solid 2px lightgray;
        }
        .main-display-background {
          width: 100%;
          display: flex;
          flex-direction: column;
        }
        footer {
          padding: 16px;
          width: 1252px;
        }
        footer > h4 {
          text-align: center;
        }
      `}</style>
    </div>
  )
}

export default Layout
