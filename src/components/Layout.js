import Header from './Header'
import MainDisplay from './MainDisplay'
import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'
import TransferModal from './TransferModal'
import OrderRequestModal from './OrderRequestModal'
import TransactionHistory from './TransactionHistory'
import { useRouter } from 'next/router'
import { BACKGROUND, TEXT, SUBTEXT, BORDER_DARK, Black } from '../colors'
import { NORMAL, XXSMALL } from '../fonts'
import { connect } from 'react-redux'
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
              Your wallet ID: {props.address}
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
        input[type=number]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        }
        button {
          border: none;
        }
        input {
          border: none;
        }
        button:focus {outline:0;}
        input:focus {outline:0;}
        body {
          box-sizing: border-box;
          font-family: 'Roboto', sans-serif;
          font-weight: 500;
          background: ${BACKGROUND};
          color: ${TEXT};
          ${(isDepositModalOpen,
          isWithdrawModalOpen,
          isTransferModalOpen,
          isOrderRequestModalOpen ? 'overflow: hidden;' : '')}
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
          font-size: ${XXSMALL};
          font-weight: ${NORMAL};
          color: ${SUBTEXT};
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
          border-left: 1px solid ${BORDER_DARK};
          background-color: ${Black(0.05)};
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

const mapStateToProps = state => ({
  address: state.address
})
export default connect(mapStateToProps, undefined)(Layout)
