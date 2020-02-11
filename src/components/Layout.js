import Header from './Header'
import MainDisplay from './MainDisplay'
import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'
import TransferModal from './TransferModal'
import OrderRequestModal from './OrderRequestModal'
import TransactionHistory from './TransactionHistory'
import { useRouter } from 'next/router'
import { BACKGROUND, TEXT, SUBTEXT } from '../colors'
import { NORMAL } from '../fonts'
import Head from 'next/head'

const Layout = props => {
  const router = useRouter()
  const isDepositModalOpen = router.query.deposit !== undefined
  const isWithdrawModalOpen = router.query.withdraw !== undefined
  const isTransferModalOpen = router.query.transfer !== undefined
  const isOrderRequestModalOpen = router.query.orderRequest !== undefined
  return (
    <div>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,500,700&display=swap"
        />
      </Head>
      <div>
        <Header />
        <div className="layout">
          <div className="main">
            <MainDisplay>{props.children}</MainDisplay>
            <div className="wallet-id-section">
              Your wallet ID: 0x00000000000000000000000000000000
            </div>
            <footer>
              Copyright © 2020 Cryptoeconomics lab, Inc. All rights reserved.
            </footer>
          </div>
          <div className="transaction-history-wrap">
            <TransactionHistory />
          </div>
        </div>
      </div>
      {isDepositModalOpen && <DepositModal />}
      {isWithdrawModalOpen && <WithdrawModal />}
      {isTransferModalOpen && <TransferModal />}
      {isOrderRequestModalOpen && <OrderRequestModal />}
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
          font-family: 'Roboto', sans-serif;
          font-weight: 500;
          background: ${BACKGROUND};
          color: ${TEXT};
          ${isDepositModalOpen ? 'overflow: hidden;' : ''}
          ${isWithdrawModalOpen ? 'overflow: hidden;' : ''}
          ${isTransferModalOpen ? 'overflow: hidden;' : ''}
          ${isOrderRequestModalOpen ? 'overflow: hidden;' : ''}
        }
      `}</style>
      <style jsx>{`
        .layout {
          display: flex;
          height: 100%;
          min-height: 100vh;
          margin-top: 74px;
        }
        .main {
          display: flex;
          flex-direction: column;
          width: 70%;
        }
        .wallet-id-section {
          height: 32px;
          background-color: #2d2a2c;
          font-size: 12px;
          font-weight: ${NORMAL};
          color: rgba(255, 255, 255, 0.4);
          display: flex;
          align-items: center;
          padding: 10px;
        }
        .transaction-history-wrap {
          position: fixed;
          width: 30%;
          height: 100%;
          min-height: 100vh;
          top: 0;
          right: 0;
          border-left: 1px solid rgba(255, 255, 255, 0.1);
          background-color: rgba(0, 0, 0, 0.05);
        }
        footer {
          font-weight: 300;
          color: ${SUBTEXT};
          font-size: 0.75rem;
          padding: 2rem 0 1.5rem;
          text-align: center;
        }
      `}</style>
    </div>
  )
}

export default Layout
