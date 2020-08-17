import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Router, { useRouter } from 'next/router'
import Head from 'next/head'
import Box from './Base/Box'
import ClipLoader from './Base/ClipLoader'
import Alert from './Base/Alert'
import Header from './Header'
import StartupModal from './StartupModal'
// import { Tabs } from './Tabs'
import Wallet from './Wallet'
import {
  TEXT,
  BACKGROUND,
  SUBTEXT,
  ERROR,
  MAIN,
  MAIN_DARK,
  WARNING
} from '../constants/colors'
import {
  FW_BOLD,
  FZ_MEDIUM,
  FZ_SMALL,
  FZ_DEFAULT,
  FZ_LARGE,
  FZ_HEADLINE,
  FW_NORMAL,
  FW_BLACK
} from '../constants/fonts'
import {
  WALLET,
  HISTORY
  // PAYMENT,
  // EXCHANGE,
  // NFT_COLLECTIBLES,
} from '../routes'
import { pushRouteHistory, popRouteHistory } from '../store/appRouter'
import {
  APP_STATUS,
  SYNCING_STATUS,
  checkClientInitialized
} from '../store/appStatus'
import { removeToast } from '../store/toast'
import { useReactToast } from '../hooks'

const Initial = ({
  checkClientInitialized,
  pushRouteHistory,
  popRouteHistory,
  appStatus,
  toasts,
  removeToast,
  children
}) => {
  const router = useRouter()
  useReactToast({ toasts: toasts, onDisappearToast: removeToast })
  const isWalletHidden =
    router.pathname === WALLET || router.pathname === HISTORY
  // const isTabShownHidden =
  //   appStatus.status === APP_STATUS.LOADED &&
  //   (router.pathname === PAYMENT ||
  //     router.pathname === EXCHANGE ||
  //     router.pathname === NFT_COLLECTIBLES)

  useEffect(() => {
    checkClientInitialized()
    pushRouteHistory(router.pathname)
    Router.events.on('routeChangeComplete', url => {
      pushRouteHistory(url.split('?')[0])
    })
    Router.beforePopState(() => {
      popRouteHistory()
      return true
    })
  }, [])

  const content =
    appStatus.status === APP_STATUS.UNLOADED ||
    appStatus.status === APP_STATUS.ERROR ? (
      <div>
        <StartupModal />
      </div>
    ) : appStatus.status === APP_STATUS.LOADED ? (
      children
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
        <Alert>
          Please note that this wallet is the alpha version and there is a
          possibility of losing your deposited funds. If you want to use testnet
          token, you can get Kovan Ether (KETH) from{' '}
          <a
            href="https://faucet.kovan.network/"
            className="alert__link"
            target="_blank"
            rel="noopener"
          >
            here
          </a>
          .
        </Alert>
        <h2 className="headline">
          {router.pathname !== HISTORY ? 'Your Wallet' : 'Transaction History'}
        </h2>
        {!isWalletHidden && (
          <Box>
            <div className="wallet">
              {appStatus.status !== APP_STATUS.LOADED ? (
                <span className="wallet__txt">No Wallet</span>
              ) : (
                <Wallet />
              )}
            </div>
          </Box>
        )}
        <Box>
          {/* {isTabShownHidden && <Tabs currentPath={router.pathname} />} */}
          {content}
        </Box>
        {appStatus.status === APP_STATUS.LOADED && (
          <div className="logoutButtonWrap">
            <a
              className="logoutButton"
              onClick={() => {
                localStorage.removeItem('loggedInWith')
                location.reload()
              }}
            >
              Logout
            </a>
          </div>
        )}
        {appStatus.syncingStatus === SYNCING_STATUS.LOADING && <ClipLoader />}
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
          margin: 1rem auto 0;
        }
        .headline {
          font-weight: ${FW_BOLD};
          font-size: ${FZ_MEDIUM};
          color: ${SUBTEXT};
          margin-bottom: 0.5rem;
          margin-top: 1.5rem;
        }
        .wallet {
          margin: -0.375rem 0;
        }
        .wallet__txt {
          color: ${SUBTEXT};
        }
        .alert__link {
          color: ${WARNING};
          font-weight: ${FW_BLACK};
        }
        .error {
          color: ${ERROR};
          text-align: center;
          margin-top: 0.75rem;
          font-size: ${FZ_MEDIUM};
        }
        .logoutButtonWrap {
          text-align: center;
          margin-top: 2rem;
        }
        .logoutButton {
          cursor: pointer;
          text-decoration: underline;
          display: inline-block;
          color: ${ERROR};
          font-size: ${FZ_MEDIUM};
          font-weight: ${FW_BLACK};
        }
        .logoutButton:hover {
          text-decoration: none;
        }
      `}</style>
    </div>
  )
}

const mapStateToProps = state => ({
  appStatus: state.appStatus,
  toasts: state.toastState.toasts
})

const mapDispatchToProps = {
  checkClientInitialized,
  pushRouteHistory,
  popRouteHistory,
  removeToast
}

export default connect(mapStateToProps, mapDispatchToProps)(Initial)
