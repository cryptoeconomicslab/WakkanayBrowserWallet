import { useRouter } from 'next/router'
import { connect } from 'react-redux'

import Dropdown from './Dropdown'
import { TokenSelectButton } from './TokenSelectButton'
import { setTransferredToken } from '../store/transfer'
import { shortenAddress, TOKEN_CURRENCY_MAP } from '../utils'
import { PrimaryButton } from './PrimaryButton'
import { SectionTitle } from '../components/SectionTitle'
import {
  EXTRABOLD,
  XSMALL,
  SMALLER,
  SMALL,
  MEDIUM,
  LARGER,
  LARGERPLUS
} from '../fonts'
import {
  SUBTEXT,
  SECTION_BACKGROUND,
  BORDER,
  PRIMARY_BUTTON_TEXT
} from '../colors'

const OrderBook = props => {
  const router = useRouter()
  const transferredToken = props.transferredToken
  const tokenBalanceList = props.tokenBalanceList

  return (
    <div className="orderbook-section" id="order-book">
      <SectionTitle>Exchange Order Book</SectionTitle>
      <div className="search-box">
        <div className="paid-token-box">
          <div className="paid-token-title">Exchanged</div>
          <div className="paid-token-select-box-wrapper">
            <Dropdown
              width="100%"
              onSelected={props.setTransferredToken}
              buttonName={
                <div className="button-name-inner">
                  <div className="exchanged-token-img-bg">
                    <img
                      className="exchanged-token-img"
                      src="../ethereum-icon.png"
                      alt="Ethereum Logo"
                    ></img>
                  </div>
                  <div className="token-name">
                    {/* {shortenAddress(transferredToken)} (
                    {TOKEN_CURRENCY_MAP[transferredToken]}) */}
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
                <TokenSelectButton item={item} padding="28px" />
              )}
            />
          </div>
        </div>
        <div className="max-paid-amount-box">
          <div className="max-paid-amount-title">Max Paid</div>
          <div className="max-paid-amount-input-wrapper">
            <input className="max-paid-amount-input" type="text"></input>
            <div className="max-paid-amount-unit">USD</div>
          </div>
        </div>
        <div className="received-token-box">
          <div className="received-token-title">Received</div>
          <div className="received-token-select-box-wrapper">
            <Dropdown
              onSelected={props.setTransferredToken}
              buttonName={
                <div className="button-name-inner">
                  <div className="exchanged-token-img-bg">
                    <img
                      className="exchanged-token-img"
                      src="../ethereum-icon.png"
                      alt="Eth Logo"
                    ></img>
                  </div>
                  <div className="token-name">
                    {/* {shortenAddress(transferredToken)} (
                    {TOKEN_CURRENCY_MAP[transferredToken]}) */}
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
                <TokenSelectButton item={item} padding="28px" />
              )}
            />
          </div>
        </div>
        <div className="search-button">
          <PrimaryButton>
            <img
              className="seach-icon"
              src="//ssl.gstatic.com/images/icons/material/system/2x/search_white_24dp.png"
              height="24"
              width="24"
            />
            <a>Search</a>
          </PrimaryButton>
        </div>
        <div className="or">or</div>
        <button
          className="create-new-request-button"
          onClick={e => {
            e.preventDefault()
            const href = `${router.route}?orderRequest`
            router.push(href, href, { shallow: true })
          }}
        >
          Create New Request
        </button>
      </div>
      <div className="order-list">
        <div className="order-list-item">
          <div className="token-box-wrapper">
            <div className="token-box">
              <div className="l2-token-img-bg">
                <img
                  className="l2-token-img"
                  src="../ethereum-icon.png"
                  alt="Ethereum Logo"
                ></img>
              </div>
              <div className="amount-content">
                <div className="amount-box">
                  <div className="token-type">ETH</div>
                  <div className="amount">0.01</div>
                </div>
                <div className="amount-in-usd">9.33 USD</div>
              </div>
            </div>
            <div className="arrow">
              <img src="../arrow.png" width="41"></img>
            </div>
            <div className="token-box">
              <div className="l2-token-img-bg">
                <img
                  className="l2-token-img"
                  src="../dai-icon.png"
                  alt="Dai Logo"
                ></img>
              </div>
              <div className="amount-content">
                <div className="amount-box">
                  <div className="token-type">DAI</div>
                  <div className="amount">9.35</div>
                </div>
                <div className="amount-in-usd">9.35 USD</div>
              </div>
            </div>
          </div>
          <button className="exchange-button">Exchange</button>
        </div>
      </div>
      <style jsx>{`
        .orderbook-section {
          width: calc(100% - 40px);
          display: flex;
          flex-direction: column;
          margin: 20px 0px;
        }
        .search-box {
          margin-top: 20px;
          width: 100%;
          display: flex;
          align-items: center;
        }
        .paid-token-title,
        .max-paid-amount-title,
        .received-token-title {
          width: 100%;
          font-weight: 800;
          font-size: ${XSMALL};
          margin-bottom: 8px;
          color: ${SUBTEXT};
        }
        .paid-token-box {
          display: flex;
          flex-direction: column;
          text-align: center;
        }
        .paid-token-select-box-wrapper {
          width: 136px;
          height: 45px;
          background-color: transparent;
          border-right: none;
          border: 1px solid ${BORDER};
          border-radius: 40px 0px 0px 40px;
          display: flex;
          align-items: center;
        }
        .button-name-inner {
          width: 100%;
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        .paid-token-select-box-wrapper :global(.dropdown-button) {
          font-size: ${SMALL};
          font-weight: 400;
        }
        .exchanged-token-img-bg {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 4px;
        }
        .exchanged-token-img {
          height: 22px;
        }
        .token-name {
          margin-left: 8px;
        }
        .max-paid-amount-box {
          display: flex;
          flex-direction: column;
          text-align: center;
          margin-right: 16px;
        }
        .max-paid-amount-input-wrapper {
          border: 1px solid ${BORDER};
          border-radius: 0px 40px 40px 0px;
          font-weight: 300;
          width: 120px;
          height: 45px;
          background-color: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .max-paid-amount-input {
          border: none;
          width: 64px;
          font-size: ${LARGERPLUS};
          font-weight: 300;
          color: #ffffff;
          background-color: transparent;
        }
        .max-paid-amount-unit {
          font-weight: 800;
          font-size: ${XSMALL};
          color: ${SUBTEXT};
        }
        .received-token-box {
          display: flex;
          flex-direction: column;
          text-align: center;
        }
        .received-token-select-box-wrapper {
          border: 1px solid ${BORDER};
          border-radius: 40px;
          font-size: ${SMALL};
          width: 136px;
          height: 45px;
          background-color: transparent;
        }
        .received-token-select-box-wrapper :global(.dropdown-button) {
          font-size: ${SMALL};
          font-weight: 400;
        }
        .search-button {
          margin-left: 16px;
          margin-top: 20px;
        }
        .search-button:active {
          transform: translateY(2px) translateX(1px);
        }
        .search-icon {
          height: 24px;
          width: 24px;
          pointer-events: auto;
        }
        .search {
          font-weight: 800;
          font-size: ${SMALL};
          color: ${PRIMARY_BUTTON_TEXT};
        }
        .or {
          margin-top: 20px;
          height: 40px;
          display: flex;
          align-items: center;
          margin-left: 16px;
          color: ${SUBTEXT};
        }
        .create-new-request-button {
          margin-left: 16px;
          margin-top: 20px;
          border-radius: 40px;
          width: 167px;
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          border: 1px solid ${BORDER};
          font-size: ${SMALLER};
          font-weight: ${EXTRABOLD};
          color: ${PRIMARY_BUTTON_TEXT};
          background: transparent;
        }
        .order-list {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          width: 100%;
          margin-top: 25px;
        }
        .order-list-item {
          width: 100%;
          height: 72px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: ${SECTION_BACKGROUND};
          padding: 16px;
          margin-bottom: 10px;
        }
        .token-box-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .token-box {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .l2-token-img-bg {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .l2-token-img {
          height: 25px;
        }
        .amount-content {
          margin-left: 13px;
        }
        .amount-box {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .token-type {
          font-size: ${MEDIUM};
          font-weight: 400;
          margin-right: 5px;
        }
        .amount {
          font-size: ${LARGER};
          font-weight: 300;
        }
        .amount-in-usd {
          font-size: ${SMALLER};
          color: ${SUBTEXT};
          font-weight: 400;
        }
        .arrow {
          margin: 0px 38px;
        }
        .exchange-button {
          border-radius: 40px;
          border: none;
          width: 93px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #4e3ff4;
          color: ${PRIMARY_BUTTON_TEXT};
          cursor: pointer;
          font-size: ${SMALLER};
          font-weight: ${EXTRABOLD};
        }
      `}</style>
    </div>
  )
}

const mapStateToProps = state => ({
  tokenBalanceList: state.balance.tokenBalanceList,
  transferredToken: state.transferState.transferredToken
})

const mapDispatchToProps = {
  setTransferredToken
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderBook)
