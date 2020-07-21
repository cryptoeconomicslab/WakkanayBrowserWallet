import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Router, { useRouter } from 'next/router'
import Head from 'next/head'
import Box from './Base/Box'
import ErrorAlert from './Base/ErrorAlert'
import { config } from '../config'
import Header from './Header'
import StartupModal from './StartupModal'
// import { Tabs } from './Tabs'
import Wallet from './Wallet'
import { TEXT, BACKGROUND, SUBTEXT, MAIN, MAIN_DARK } from '../constants/colors'
import {
  FW_BOLD,
  FZ_MEDIUM,
  FZ_SMALL,
  FZ_DEFAULT,
  FZ_LARGE,
  FZ_HEADLINE,
  FW_NORMAL
} from '../constants/fonts'
import {
  WALLET,
  HISTORY,
  // PAYMENT,
  // EXCHANGE,
  // NFT_COLLECTIBLES,
  openModal
} from '../routes'
import { pushRouteHistory, popRouteHistory } from '../store/appRouter'
import { APP_STATUS, checkClientInitialized } from '../store/appStatus'
import {
  getL1TotalBalance,
  getTokenTotalBalance,
  errorSetL1Balance,
  errorSetTokenBalance,
  errorSetETHtoUSD
} from '../store/tokenBalanceList'
import { errorSetHistoryList } from '../store/transactionHistory'
import { errorTransfer } from '../store/transfer'

const Initial = props => {
  const router = useRouter()
  const isWalletHidden =
    router.pathname === WALLET || router.pathname === HISTORY
  // const isTabShownHidden =
  //   props.appStatus.status === 'loaded' &&
  //   (router.pathname === PAYMENT ||
  //     router.pathname === EXCHANGE ||
  //     router.pathname === NFT_COLLECTIBLES)

  useEffect(() => {
    props.checkClientInitialized()
    props.pushRouteHistory(router.pathname)
    Router.events.on('routeChangeComplete', url => {
      props.pushRouteHistory(url.split('?')[0])
    })
    Router.beforePopState(() => {
      props.popRouteHistory()
      return true
    })
  }, [])

  const content =
    props.appStatus.status === 'unloaded' ||
    props.appStatus.status === 'error' ? (
      <div>
        <StartupModal />
      </div>
    ) : props.appStatus.status === 'loaded' ? (
      props.children
    ) : (
      <p>loading...</p>
    )

  return (
    <div>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:400,700,900&display=swap"
        />
      </Head>
      <Header />
      <div className="container">
        {/* TODO: how to show the errors */}
        <ErrorAlert
          isShown={props.tokenBalance.errorEthToUSD}
          onClose={() => {
            props.errorSetETHtoUSD(false)
          }}
        >
          Get ETH-USD rate failed.
        </ErrorAlert>

        <ErrorAlert
          isShown={props.tokenBalance.errorL1Balance}
          onClose={() => {
            props.errorSetL1Balance(false)
          }}
        >
          Get your L1 balance failed.
        </ErrorAlert>

        <ErrorAlert
          isShown={props.tokenBalance.errorTokenBalance}
          onClose={() => {
            props.errorSetTokenBalance(false)
          }}
        >
          Get your balance failed.
        </ErrorAlert>

        <ErrorAlert
          isShown={props.tokenBalance.errorHistoryList}
          onClose={() => {
            props.errorSetHistoryList(false)
          }}
        >
          Get your transaction history failed.
        </ErrorAlert>

        <ErrorAlert
          isShown={props.transfer.transferError}
          onClose={() => {
            props.errorTransfer(false)
          }}
        >
          Transfer failed.
        </ErrorAlert>

        <ErrorAlert
          isShown={props.appStatus.status === APP_STATUS.ERROR}
          onClose={() => {
            props.setAppError(null)
          }}
        >
          {props.appStatus.error}
        </ErrorAlert>

        <h2 className="headline">
          {router.pathname !== HISTORY ? 'Your Wallet' : 'Transaction History'}
        </h2>
        {!isWalletHidden && (
          <Box>
            <div className="wallet">
              {props.appStatus.status !== 'loaded' ? (
                <span className="wallet__txt">No Wallet</span>
              ) : (
                <Wallet
                  l2={props.tokenTotalBalance}
                  mainchain={props.l1TotalBalance}
                  address={props.address}
                  onDeposit={() => {
                    openModal({
                      modal: 'deposit',
                      token: config.PlasmaETH
                    })
                  }}
                />
              )}
            </div>
          </Box>
        )}
        <Box>
          {/* {isTabShownHidden && <Tabs currentPath={router.pathname} />} */}
          {content}
        </Box>
      </div>
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
        a {
          color: ${MAIN};
        }
        a:hover {
          color: ${MAIN_DARK};
          text-decoration: none;
        }
        button:focus {outline:0;}
        input:focus {outline:0;}
        body {
          box-sizing: border-box;
          font-family: Roboto, sans-serif;
          font-weight: ${FW_NORMAL};
          background: ${BACKGROUND};
          color: ${TEXT};
        }
        .sub {
          font-size: ${FZ_MEDIUM};
          color: ${SUBTEXT};
        }
        .fzs {
          font-size: ${FZ_SMALL} !important;
        }
        .fzm {
          font-size: ${FZ_MEDIUM} !important;
        }
        .fzd {
          font-size: ${FZ_DEFAULT} !important;
        }
        .fzl {
          font-size: ${FZ_LARGE} !important;
        }
        .fzh {
          font-size: ${FZ_HEADLINE} !important;
        }
        .mbs {
          margin-bottom: 0.875rem
        }
        .mts {
          margin-top: 0.875rem
        }
        .mbm {
          margin-bottom: 1.5rem
        }
        .mtm {
          margin-top: 1.5rem
        }
        .mtl {
          margin-top: 2rem;
        }
      `}</style>
      <style jsx>{`
        .container {
          max-width: 37.5rem;
          margin: 0 auto;
        }
        .headline {
          font-weight: ${FW_BOLD};
          font-size: ${FZ_MEDIUM};
          color: ${SUBTEXT};
          margin-bottom: 0.5rem;
        }
        .wallet {
          margin: -0.375rem 0;
        }
        .wallet__txt {
          color: ${SUBTEXT};
        }
      `}</style>
    </div>
  )
}

const mapStateToProps = state => ({
  address: state.address,
  appRouter: state.appRouter,
  appStatus: state.appStatus,
  tokenBalance: state.tokenBalance,
  history: state.history,
  transfer: state.transferState,
  l1TotalBalance: getL1TotalBalance(state),
  tokenTotalBalance: getTokenTotalBalance(state)
})

const mapDispatchToProps = {
  checkClientInitialized,
  pushRouteHistory,
  popRouteHistory,
  errorSetL1Balance,
  errorSetTokenBalance,
  errorSetETHtoUSD,
  errorSetHistoryList,
  errorTransfer
}

export default connect(mapStateToProps, mapDispatchToProps)(Initial)
