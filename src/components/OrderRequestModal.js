import { connect } from 'react-redux'
import { useState, useRef } from 'react'

//react-font-awesome import
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowsAltH, faTimes } from '@fortawesome/free-solid-svg-icons'
library.add(faArrowsAltH, faTimes)

import {
  setRequestedTokenToExchange,
  setRequestedTokenToReceive,
  setOrderRequestPage
} from '../store/exchange'
import { roundBalance } from '../utils'
import Dropdown from './Dropdown'
import { PrimaryButton } from './PrimaryButton'
import { TokenSelectButton } from './TokenSelectButton'
import {
  SUBTEXT,
  BORDER,
  PRIMARY_BUTTON_TEXT,
  White,
  Black
} from '../constants/colors'
import {
  XSMALL,
  SMALLER,
  SMALL,
  LARGE,
  XLARGE,
  XXSMALL,
  NORMAL
} from '../constants/fonts'
import { TOKEN_LIST } from '../constants/tokens'
import { BaseModal } from './Base/BaseModal'

const OrderRequestModal = props => {
  const exchangedAmountInput = useRef('')
  const receivedAmountInput = useRef('')
  const [requestedAmountToExchange, setRequestedAmountToExchnage] = useState(0)
  const [requestedAmountToReceive, setRequestedAmountToReceive] = useState(0)

  const requestedTokenToExchangeObj = TOKEN_LIST.find(
    ({ depositContractAddress }) =>
      depositContractAddress === props.requestedTokenToExchange
  )
  const requestedTokenToReceiveObj = TOKEN_LIST.find(
    ({ depositContractAddress }) =>
      depositContractAddress === props.requestedTokenToReceive
  )
  return (
    <BaseModal
      title={'Exchange Order Request'}
      onClose={() => {
        props.setOrderRequestPage('input-page')
      }}
      render={modal => {
        return (
          <>
            {props.orderRequestPage === 'input-page' ? (
              <div className="order-request-page" id="order-request">
                <div className="exchange-order-request-box">
                  <div className="token-box">
                    <div className="action-title">Pay</div>
                    <div className="token-select-box-wrapper">
                      <Dropdown
                        onselect={selectedTokenContractAddress => {
                          props.setRequestedTokenToExchange(
                            selectedTokenContractAddress
                          )
                        }}
                        width="100%"
                        topButtonName={item => (
                          <TokenSelectButton item={item} padding="4px 8px" />
                        )}
                        items={TOKEN_LIST}
                        renderItem={item => (
                          <TokenSelectButton item={item} padding="4px 8px" />
                        )}
                        selectedItem={requestedTokenToExchangeObj}
                      />
                    </div>
                    <input
                      className="amount-input"
                      type="number"
                      ref={exchangedAmountInput}
                      onChange={e => {
                        setRequestedAmountToExchnage(Number(e.target.value))
                      }}
                    />
                    <div className="amount-in-usd">
                      {roundBalance(props.ETHtoUSD, requestedAmountToExchange)}{' '}
                      USD
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
                        onselect={selectedTokenContractAddress => {
                          props.setRequestedTokenToReceive(
                            selectedTokenContractAddress
                          )
                        }}
                        width="100%"
                        topButtonName={item => (
                          <TokenSelectButton item={item} padding="4px 8px" />
                        )}
                        items={TOKEN_LIST}
                        renderItem={item => (
                          <TokenSelectButton item={item} padding="4px 8px" />
                        )}
                        selectedItem={requestedTokenToReceiveObj}
                      />
                    </div>
                    <input
                      className="amount-input"
                      type="number"
                      ref={receivedAmountInput}
                      onChange={e => {
                        setRequestedAmountToReceive(Number(e.target.value))
                      }}
                    />
                    <div className="amount-in-usd">
                      {roundBalance(props.ETHtoUSD, requestedAmountToReceive)}{' '}
                      USD
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
                        <div className="token-new-amount-in-usd">
                          215.18 USD
                        </div>
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
                      exchangedAmountInput.current.value = ''
                      receivedAmountInput.current.value = ''
                      setRequestedAmountToExchnage(0)
                      setRequestedAmountToReceive(0)
                    }}
                  >
                    <a className="cancel">Cancel</a>
                  </div>
                  <div className="create-button">
                    <PrimaryButton
                      onClick={() => {
                        props.setOrderRequestPage('confirmation-page')
                      }}
                    >
                      Create
                    </PrimaryButton>
                  </div>
                </div>
              </div>
            ) : props.orderRequestPage === 'confirmation-page' ? (
              <div className="confirmation-page">
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
                  <div
                    className="confirm-button"
                    onClick={() => {
                      props.setOrderRequestPage('completion-page')
                    }}
                  >
                    <PrimaryButton>Confirm</PrimaryButton>
                  </div>
                </div>
                <div>Click confirm to open Metamask</div>
              </div>
            ) : (
              <div>Exchange order is successfully requested </div>
            )}
            <style jsx>{`
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
          </>
        )
      }}
    ></BaseModal>
  )
}

const mapStateToProps = state => ({
  tokenBalanceList: state.tokenBalance.tokenBalance,
  requestedTokenToExchange: state.exchangeState.requestedTokenToExchange,
  requestedTokenToReceive: state.exchangeState.requestedTokenToReceive,
  orderRequestPage: state.exchangeState.orderRequestPage,
  ETHtoUSD: state.tokenBalance.ETHtoUSD
})

const mapDispatchToProps = {
  setRequestedTokenToExchange,
  setRequestedTokenToReceive,
  setOrderRequestPage
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderRequestModal)
