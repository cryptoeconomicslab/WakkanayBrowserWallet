import { useRouter } from 'next/router'
import ClickOutside from 'react-click-outside'
import React, { useState, useRef } from 'react'
import { connect } from 'react-redux'

//react-font-awesome import
import { fab } from '@fortawesome/free-brands-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEthernet } from '@fortawesome/free-solid-svg-icons'
library.add(fab, faEthernet)

import { setWithdrawnToken, setWithdrawPage, withdraw } from '../store/withdraw'
import { shortenAddress, roundBalance } from '../utils'
import Dropdown from './Dropdown'
import { SectionTitle } from './SectionTitle'
import { TokenSelectButton } from './TokenSelectButton'
import { PrimaryButton } from './PrimaryButton'

import {
  SMALL,
  SMALLPLUS,
  MEDIUM,
  LARGER,
  BOLD,
  XLARGE,
  NORMAL,
  SMALLER
} from '../fonts'
import {
  White,
  MODAL_BACKGROUND,
  MODAL_MAIN_BACKGROUND,
  BORDER,
  PRIMARY_BUTTON_TEXT,
  SUBTEXT
} from '../colors'
import { TOKEN_LIST } from '../tokens'

const WithdrawModal = props => {
  const router = useRouter()
  const [tokenAmount, setTokenAmount] = useState(0)
  const amountInput = useRef('')
  const withdrawnTokenObj = TOKEN_LIST.find(
    ({ tokenContractAddress }) => tokenContractAddress === props.withdrawnToken
  )

  return (
    <div className="modal-bg">
      <ClickOutside
        className="modal-main"
        onClickOutside={e => {
          e.preventDefault()
          const href = `${router.route}`
          router.push(href)
          props.setWithdrawPage('input-page')
        }}
      >
        <div className="contents">
          {props.withdrawPage === 'input-page' ? (
            <div className="input-page">
              <div className="mordal-page-title">
                <SectionTitle>
                  Withdraw Funds from Mainchain Account
                </SectionTitle>
              </div>
              <div className="input-contents-box">
                <div className="token-select-box-wrapper">
                  <Dropdown
                    onselect={selectedTokenContractAddress => {
                      props.setWithdrawnToken(selectedTokenContractAddress)
                    }}
                    topButtonName={item => (
                      <TokenSelectButton item={item} padding="8px 16px" />
                    )}
                    items={TOKEN_LIST}
                    renderItem={item => (
                      <TokenSelectButton item={item} padding="8px 16px" />
                    )}
                    selectedItem={withdrawnTokenObj}
                  />
                </div>
                <div className="amount-input-wrapper">
                  <input
                    className="amount-input"
                    type="number"
                    ref={amountInput}
                    onChange={e => {
                      setTokenAmount(Number(e.target.value))
                    }}
                  />
                  <div className="deposited-token-unit">
                    {withdrawnTokenObj.unit}
                  </div>
                </div>
                <div className="deposited-token-confirm">
                  = {roundBalance(props.ETHtoUSD, tokenAmount)} USD / from{' '}
                  {shortenAddress(props.address)}
                </div>
                <div className="cancel-deposit-buttons">
                  <div
                    className="cancel-button"
                    onClick={() => {
                      amountInput.current.value = ''
                      setTokenAmount(0)
                    }}
                  >
                    <a className="cancel">Cancel</a>
                  </div>
                  <div className="deposit-button">
                    <PrimaryButton
                      onClick={() => {
                        props.setWithdrawPage('confirmation-page')
                      }}
                    >
                      Withdraw
                    </PrimaryButton>
                  </div>
                </div>
              </div>
            </div>
          ) : props.withdrawPage === 'confirmation-page' ? (
            <div className="confirmation-page">
              <div className="mordal-page-title">Transaction Summary</div>
              <div className="amount-confirmation-section">
                <div className="amount-confirmation-title">
                  <a>You will withdraw</a>
                </div>
                <div className="amount-confirmation-box">
                  <img
                    className="token-logo"
                    src="../tokenIcons/ethereum-logo.png"
                    alt="Ethereum Logo"
                  ></img>
                  <div className="total-balance-box">
                    <span className="total-balance-number">{tokenAmount}</span>
                    <span className="total-balance-unit">
                      {withdrawnTokenObj.unit}
                    </span>
                    <div className="balance-in-usd">
                      {roundBalance(props.ETHtoUSD, tokenAmount)} USD
                    </div>
                  </div>
                </div>
              </div>
              <div className="account-confirmation-section">
                <div className="from">
                  from{' '}
                  <a className="address">{shortenAddress(props.address)}</a>
                </div>
                <div className="to">to your Wakkanay Wallet</div>
              </div>
              <div className="cancel-next-buttons">
                <div
                  className="cancel-button"
                  onClick={() => {
                    props.setWithdrawPage('input-page')
                  }}
                >
                  <a className="cancel">Cancel</a>
                </div>
                <div
                  className="confirm-button"
                  onClick={() => {
                    props.setWithdrawPage('completion-page')
                  }}
                >
                  <PrimaryButton>Confirm</PrimaryButton>
                </div>
              </div>
              <div>Click confirm to open Metamask</div>
            </div>
          ) : (
            <div>Withdraw completed</div>
          )}
        </div>
      </ClickOutside>
      <style jsx>{`
        .modal-bg {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 100vw;
          background: ${MODAL_BACKGROUND};
          display: flex;
          justify-content: center;
        }
        .modal-bg > :global(.modal-main) {
          position: fixed;
          top: calc(20% + 10px);
          width: 50%;
          min-width: 520px;
          height: calc(50% - 20px);
          background: ${MODAL_MAIN_BACKGROUND};
          opacity: 1;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow: scroll;
        }
        .contents {
          padding: 0px 32px 16px 32px;
        }
        .input-page {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .mordal-page-title {
          margin: 60px 40px 0px 40px;
          margin-right: 40px;
        }
        .input-contents-box {
          margin-top: 30px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .token-select-box-wrapper {
          width: 420px;
          height: 48px;
          background: ${White(0.05)};
          border-radius: 4px;
          display: flex;
        }
        .button-name-inner {
          width: 100%;
          padding: 8px 8px 8px 22px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        .token-select-box-wrapper :global(.dropdown-button) {
          font-size: ${SMALL};
          font-weight: 400;
        }
        .token-select-box-wrapper :global(.dropdown-caret) {
          font-size: ${MEDIUM};
        }
        .l2-token-img-bg {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .l2-token-img {
          height: 22px;
        }
        .token-name {
          margin-left: 8px;
        }
        .amount-input-wrapper {
          width: 420px;
          display: flex;
          margin-top: 16px;
          align-items: center;
          justify-content: center;
          background: ${White(0.04)};
          padding-right: 14px;
        }
        .amount-input {
          height: 48px;
          font-size: ${XLARGE};
          font-weight: ${NORMAL};
          color: #ffffff;
          border: none;
          background: transparent;
          border-radius: 4px;
          padding: 8px;
        }
        .deposited-token-unit,
        .deposited-token-confirm {
          font-weight: ${BOLD};
          font-size: ${SMALLER};
          color: ${SUBTEXT};
        }
        .deposited-token-confirm {
          margin-top: 8px;
          margin-right: 4px;
        }
        .token-amount-confirm-section {
          margin-top: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .token-amount {
          margin: -3px 14px;
          margin-left: 10px;
          font-size: ${LARGER};
          font-weight: 600;
        }
        .cancel-deposit-buttons {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 40px;
          margin-top: 24px;
          margin-bottom: 8px;
          width: inherit;
        }
        .cancel-button {
          background: transparent;
          border: 1px solid ${BORDER};
          margin-right: 24px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 108px;
          height: 40px;
          border-radius: 40px;
          font-size: ${SMALL};
          font-weight: 800;
          color: ${PRIMARY_BUTTON_TEXT};
          cursor: pointer;
        }
        .confirmation-page {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .from,
        .to {
          font-size: ${MEDIUM};
          font-weight: 500;
        }
        .address {
          font-size: ${MEDIUM};
          font-weight: 500;
          color: lightslategray;
        }
        .account-confirmation-section {
          margin-bottom: 20px;
        }
        .amount-confirmation-section {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .amount-confirmation-title {
          font-size: 28px;
          font-weight: 500;
          margin-bottom: 8px;
        }
        .back-button {
          margin-right: 8px;
          font-size: 28px;
          width: 100%;
          margin-left: 116px;
          cursor: pointer;
        }
        .token-logo {
          width: 48px;
          margin-right: 16px;
        }
        .amount-confirmation-box {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 16px;
        }
        .total-balance-number {
          font-size: 52px;
          font-weight: 650;
        }
        .total-balance-unit {
          font-size: 30px;
          font-weight: 650;
          margin-left: 8px;
        }
        .balance-in-usd {
          color: darkgray;
          font-size: ${SMALLPLUS};
          font-weight: 650;
        }
      `}</style>
    </div>
  )
}

const mapStateToProps = state => ({
  tokenBalanceList: state.tokenBalance.tokenBalanceList,
  withdrawnToken: state.withdrawState.withdrawnToken,
  withdrawPage: state.withdrawState.withdrawPage,
  ETHtoUSD: state.tokenBalance.ETHtoUSD,
  address: state.address
})

const mapDispatchToProps = {
  setWithdrawnToken,
  setWithdrawPage,
  withdraw
}

export default connect(mapStateToProps, mapDispatchToProps)(WithdrawModal)
