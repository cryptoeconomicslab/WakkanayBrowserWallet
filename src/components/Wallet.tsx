import React, { useState } from 'react'
import { connect } from 'react-redux'
import ReactTooltip from 'react-tooltip'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Link from 'next/link'
import Button from './Base/Button'
import config from '../config'
import { TEXT, SUBTEXT, BACKGROUND } from '../constants/colors'
import { FW_BLACK, FZ_MEDIUM, FZ_TINY, FZ_SMALL } from '../constants/fonts'
import { WALLET, openModal } from '../routes'
import {
  getL1TotalBalance,
  getL2TotalBalance
} from '../selectors/totalBalanceSelectors'
import { AppState } from '../store'
import { STATE_LOADING_STATUS } from '../store/types'
import { shortenAddress } from '../utils'

interface Props {
  address: string
  l1TotalBalance: number
  l2TotalBalance: number
  syncingStatus: STATE_LOADING_STATUS
}

const Wallet = ({
  address,
  l1TotalBalance,
  l2TotalBalance,
  syncingStatus
}: Props) => {
  const [copied, setCopied] = useState(false)

  const updateCopy = currentCopied => () => {
    setCopied(currentCopied)
  }

  return (
    <div className="wallet">
      <div className="wallet__item">
        <span className="wallet__label">L2</span>
        {l2TotalBalance ? (
          <span className="wallet__ammount">${l2TotalBalance}</span>
        ) : (
          <Button
            size="small"
            disabled={syncingStatus === STATE_LOADING_STATUS.LOADING}
            onClick={() => {
              openModal({
                modal: 'deposit',
                token: config.PlasmaETH
              })
            }}
          >
            Deposit from mainchain
          </Button>
        )}
      </div>
      <div className="wallet__item">
        <span className="wallet__label">Mainchain</span>
        <span className="wallet__ammount">${l1TotalBalance}</span>
      </div>
      <CopyToClipboard text={address} onCopy={updateCopy(true)}>
        <div
          data-tip="React-tooltip"
          data-for="wallet-address-tooltip"
          onMouseLeave={updateCopy(false)}
        >
          <button className="copy">{shortenAddress(address)}</button>
        </div>
      </CopyToClipboard>
      <ReactTooltip
        id="wallet-address-tooltip"
        place="bottom"
        type="dark"
        effect="solid"
      >
        <span className="tooltip">
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </span>
      </ReactTooltip>
      <Link href={WALLET} passHref>
        <a className="link">View Detail</a>
      </Link>
      <style jsx>
        {`
          .wallet {
            color: ${TEXT};
            display: flex;
            align-items: center;
          }
          .wallet__item {
            display: flex;
            align-items: center;
          }
          .wallet__item + .wallet__item {
            margin-left: 1rem;
          }
          .wallet__label {
            font-size: ${FZ_MEDIUM};
            font-weight: ${FW_BLACK};
            color: ${SUBTEXT};
            margin-right: 0.5rem;
          }
          .copy {
            display: block;
            color: ${SUBTEXT};
            font-size: ${FZ_TINY};
            margin-left: 0.5rem;
            padding: 0.25rem 0.5rem;
            border-radius: 0.75rem;
            cursor: pointer;
          }
          .copy:hover {
            background: ${BACKGROUND};
          }
          .tooltip {
            text-align: center;
            display: block;
            font-size: ${FZ_SMALL};
            margin: -0.125rem -0.5rem;
            width: 6rem;
          }
          .link {
            margin-left: auto;
            font-size: ${FZ_MEDIUM};
            display: block;
          }
        `}
      </style>
    </div>
  )
}

const mapStateToProps = (state: AppState) => ({
  address: state.address.item,
  syncingStatus: state.appStatus.syncingStatus,
  l1TotalBalance: getL1TotalBalance(state),
  l2TotalBalance: getL2TotalBalance(state)
})
export default connect(mapStateToProps)(Wallet)
