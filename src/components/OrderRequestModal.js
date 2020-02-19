import { useRouter } from 'next/router'
import ClickOutside from 'react-click-outside'
import { connect } from 'react-redux'
import { useState, useRef } from 'react'

//react-font-awesome import
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowsAltH, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add(faArrowsAltH, faTimes)

import {
  setRequestedTokenToExchange,
  setRequestedAmountToExchange,
  setRequestedTokenToReceive,
  setRequestedAmountToReceive,
  setOrderRequestPage
} from '../store/exchange'
import { shortenAddress, TOKEN_CURRENCY_MAP } from '../utils'
import Dropdown from './Dropdown'
import { PrimaryButton } from './PrimaryButton'
import { TokenSelectButton } from './TokenSelectButton'
import {
  MODAL_BACKGROUND,
  MODAL_MAIN_BACKGROUND,
  SUBTEXT,
  BORDER,
  PRIMARY_BUTTON_TEXT,
  White,
  Black
} from '../colors'
import {
  XSMALL,
  SMALLER,
  SMALL,
  LARGE,
  XLARGE,
  XXSMALL,
  NORMAL
} from '../fonts'

const OrderRequestModal = props => {
  const router = useRouter()
  const amountInput = useRef('')
  const amountRef = useRef('')
  const [requestedAmountToExchange, setRequestedAmountToExchnage] = useState(0)
  const requestedTokenToExchange = props.requestedTokenToExchange
  const requestedTokenToReceive = props.requestedTokenToReceive
  const orderRequestPage = props.orderRequestPage
  const tokenBalanceList = props.tokenBalanceList
  const ETHtoUSD = props.ETHtoUSD

  return (
    <div className="modal-bg">
      <ClickOutside
        className="modal-main"
        onClickOutside={e => {
          e.preventDefault()
          const href = `${router.route}`
          router.push(href)
          props.setOrderRequestPage('input-page')
        }}
      >
        <div className="contents">
          {orderRequestPage === 'input-page' ? (
            <div className="order-request-page" id="order-request">
              <div className="exchange-order-request-title-box">
                Exchange Order Request
              </div>
              <div className="exchange-order-request-box">
                <div className="token-box">
                  <div className="action-title">Pay</div>
                  <div className="token-select-box-wrapper">
                    <Dropdown
                      width="100%"
                      onSelected={props.setRequestedTokenToExchange}
                      buttonName={
                        <div className="button-name-inner">
                          <div className="l2-token-img-bg">
                            <img
                              className="l2-token-img"
                              src="../ethereum-icon.png"
                              alt="Ethereum Logo"
                            ></img>
                          </div>
                          <div className="token-name">
                            {/* {shortenAddress(requestedTokenToExchange)} (
                            {TOKEN_CURRENCY_MAP[requestedTokenToExchange]}) */}
                            ETH
                          </div>
                        </div>
                      }
                      items={tokenBalanceList.map(({ tokenAddress }) => ({
                        // name: shortenAddress(tokenAddress),
                        name: 'ETH',
                        value: tokenAddress
                      }))}
                      renderItem={item => (
                        <TokenSelectButton item={item} padding="32px" />
                      )}
                    />
                  </div>
                  <input
                    className="amount-input"
                    type="number"
                    ref={amountInput}
                  />
                  <div className="amount-in-usd">
                    {ETHtoUSD * amountInput.current.value} USD
                  </div>
                  <div className="insufficient-fund">Insufficient Fund</div>
                </div>
                <div className="arrow">
                  <img src="../arrow.png" width="41"></img>
                </div>
                <div className="token-box">
                  <div className="action-title">Receive</div>
                  <div className="token-select-box-wrapper">
                    <Dropdown
                      onSelected={props.setRequestedTokenToReceive}
                      buttonName={
                        <div className="button-name-inner">
                          <div className="l2-token-img-bg">
                            <img
                              className="l2-token-img"
                              src="../ethereum-icon.png"
                              alt="Ethereum Logo"
                            ></img>
                          </div>
                          <div className="token-name">
                            {/* FIXME */}
                            {/* {shortenAddress(requestedTokenToReceive)} (
                            {TOKEN_CURRENCY_MAP[requestedTokenToReceive]}) */}
                            ETH
                          </div>
                        </div>
                      }
                      items={tokenBalanceList.map(({ tokenAddress }) => ({
                        // FIXME
                        // name: shortenAddress(tokenAddress),
                        name: 'ETH',
                        value: tokenAddress
                      }))}
                      renderItem={item => (
                        <TokenSelectButton item={item} padding="32px" />
                      )}
                    />
                  </div>
                  <input
                    className="amount-input"
                    type="number"
                    ref={amountRef}
                    onChange={e => {
                      setRequestedAmountToExchnage(e.target.value)
                    }}
                  />
                  <div className="amount-in-usd">
                    {ETHtoUSD * amountRef.current.value} USD
                  </div>
                  <div className="insufficient-fund">Insufficient Fund</div>
                </div>
              </div>
              <div className="expected-balance-box">
                <div className="expected-balance-title">
                  Expected New Balance
                </div>
                <div className="expected-balance-contents">
                  <div className="token-expected-balance-box-left">
                    <div className="token-new-amount">
                      <div className="token-new-amount-in-eth">
                        <span className="token-new-amount-text">1.05</span>
                        <span className="token-type-unit">ETH</span>
                      </div>
                      <div className="token-new-amount-in-usd">215.18 USD</div>
                    </div>
                    <div className="token-paying-diff">▼ 0.05ETH</div>
                  </div>
                  <div className="token-expected-balance-box-right">
                    <div className="token-new-amount">
                      <div className="token-new-amount-in-eth">
                        <span className="token-new-amount-text">70</span>
                        <span className="token-type-unit">DAI</span>
                      </div>
                      <div className="token-new-amount-in-usd">70 USD</div>
                    </div>
                    <div className="token-receiving-diff">▲ 9.33DAI</div>
                  </div>
                </div>
              </div>
              <div className="cancel-confirm-buttons">
                <div
                  className="cancel-button"
                  onClick={() => {
                    amountInput.current.value = ''
                    amountRef.current.value = ''
                    setRequestedAmountToExchnage(0)
                  }}
                >
                  <a className="cancel">Cancel</a>
                </div>
                <div className="create-button">
                  <PrimaryButton
                    onClick={() => {
                      props.setOrderRequestPage('confirm-page')
                    }}
                  >
                    Create
                  </PrimaryButton>
                </div>
              </div>
            </div>
          ) : orderRequestPage === 'confiramtion-page' ? (
            <div className="confirmation-page">
              <div className="mordal-page-title">Transaction Summary</div>
              <div
                className="back-button"
                onClick={() => {
                  props.setOrderRequestPage('input-page')
                }}
              >
                <FontAwesomeIcon icon="arrow-left" />
              </div>
              <div className="amount-confirmation-section">
                exchange transaction summary
              </div>
              <div className="cancel-next-buttons">
                <div
                  className="cancel-button"
                  onClick={() => {
                    props.setOrderRequestPage('input-page')
                  }}
                >
                  <a className="cancel">Cancel</a>
                </div>
                <div className="confirm-button">
                  <PrimaryButton>Confirm</PrimaryButton>
                </div>
              </div>
              <div>Click confirm to open Metamask</div>
            </div>
          ) : (
            <div>Exchange Order Requested </div>
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
          background-color: ${MODAL_BACKGROUND};
          display: flex;
          justify-content: center;
        }
        .modal-bg > :global(.modal-main) {
          position: fixed;
          top: calc(10% + 10px);
          min-width: 438px;
          min-height: 440px;
          background-color: ${MODAL_MAIN_BACKGROUND};
          opacity: 1;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow: scroll;
        }
        .mordal-page-title {
          margin: 60px 40px 12px 40px;
          margin-right: 40px;
          font-size: ${LARGE};
          font-weight: 700;
          text-align: center;
        }
        .contents {
          width: 100%;
          padding: 26px;
        }
        .order-request-page {
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .exchange-order-request-title-box {
          margin-top: 32px;
          font-weight: 400;
          font-size: ${LARGE};
        }
        .exchange-order-request-box {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-top: 27px;
        }
        .token-box {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 20px;
          background-color: ${Black(0.4)};
          border-radius: 4px;
        }
        .action-title {
          font-weight: 400;
          font-size: ${LARGE};
        }
        .token-select-box-wrapper {
          margin-top: 14px;
          width: 128px;
          height: 48px;
          background-color: ${White(0.05)};
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
        .amount-input {
          width: 129px;
          height: 47px;
          font-size: ${XLARGE};
          font-weight: ${NORMAL};
          color: #ffffff;
          border: none;
          background: ${White(0.04)};
          border-radius: 4px;
          margin-top: 10px;
          padding: 8px;
        }
        .amount-in-usd {
          font-size: ${XSMALL};
          color: darkgray;
          font-weight: 640;
          margin-top: 8px;
        }
        .insufficient-fund {
          color: red;
          font-size: ${XSMALL};
          margin-top: 4px;
        }
        .arrow {
          height: 228px;
          display: flex;
          margin: 0px 16px;
          align-items: center;
        }
        .expected-balance-box {
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: ${Black(0.4)};
          border-radius: 4px;
          padding: 16px;
          margin-top: 14px;
          border-radius: 6px;
        }
        .expected-balance-title {
          font-size: ${SMALL};
          font-weight: 400;
          width: 100%;
        }
        .expected-balance-contents {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
        }
        .token-expected-balance-box-left {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-right: 58px;
        }
        .token-expected-balance-box-right {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .token-new-amount-text {
          font-size: ${XLARGE};
          font-weight: 300;
        }
        .token-type-unit {
          font-size: ${SMALLER};
          font-weight: 400;
          margin-left: 6px;
        }
        .token-new-amount-in-usd {
          font-size: ${SMALLER};
          font-weight: 400;
          color: ${SUBTEXT};
        }
        .token-paying-diff {
          font-size: ${XXSMALL};
          font-weight: 400;
          margin-left: 5px;
          color: #eb3959;
        }
        .token-receiving-diff {
          font-size: ${XXSMALL};
          font-weight: 400;
          margin-left: 5px;
          color: #2baef8;
        }
        .cancel-confirm-buttons {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding: 24px 0px;
          width: 100%;
          border-radius: 6px;
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
      `}</style>
    </div>
  )
}

const mapStateToProps = state => ({
  tokenBalanceList: state.balance.tokenBalanceList,
  requestedTokenToExchange: state.exchangeState.requestedTokenToExchange,
  requestedAmountToExchange: state.exchangeState.requestedAmountToExchange,
  requestedTokenToReceive: state.exchangeState.requestedTokenToReceive,
  requestedAmountToReceive: state.exchangeState.requestedAmountToReceive,
  orderRequestPage: state.exchangeState.orderRequestPage,
  ETHtoUSD: state.balance.ETHtoUSD
})

const mapDispatchToProps = {
  setRequestedTokenToExchange,
  setRequestedAmountToExchange,
  setRequestedTokenToReceive,
  setRequestedAmountToReceive,
  setOrderRequestPage
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderRequestModal)
