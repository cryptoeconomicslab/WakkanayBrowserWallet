import { useRef } from 'react'
import { useRouter } from 'next/router'
import { SUBTEXT, BACKGROUND, SECTION_BACKGROUND, BORDER } from '../colors'

//react-font-awesome import
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
library.add(faSignOutAlt)

import { connect } from 'react-redux'
import Dropdown from './Dropdown'
import { getBalance, getETHtoUSD } from '../store/tokenBalanceList'
import {
  setTransferredToken,
  setTransferredAmount,
  setRecepientAddress
} from '../store/transfer'
import { shortenAddress, TOKEN_CURRENCY_MAP } from '../utils'
import { PrimaryButton } from './PrimaryButton'
import { SectionTitle } from '../components/SectionTitle'
import { NORMAL, SMALL, MEDIUM, XLARGE } from '../fonts'

const Send = props => {
  const router = useRouter()
  const recepientAddressRef = useRef('')
  const amountRef = useRef('')
  const transferredToken = props.transferredToken
  const tokenBalanceList = props.tokenBalanceList

  const tokenBalance = tokenBalanceList.find(
    ({ tokenAddress }) => tokenAddress === transferredToken
  )

  return (
    <div className="send-section" id="send">
      <SectionTitle>Send Token</SectionTitle>
      {/* <div className="balance-box">
            <div className="total-balance-box">
              <span className="total-balance-number">
                {tokenBalance ? tokenBalance.amount : ''}
              </span>
              <span className="total-balance-unit">
                {TOKEN_CURRENCY_MAP[transferredToken]}
              </span>
              <div className="balance-in-usd">
                {props.ETHtoUSD * props.balance} USD
              </div>
            </div>
          </div>
       */}
      <div className="address-box">
        <div className="address-title">Address</div>
        <input
          placeholder={'0x00000000000'}
          className="recepient-address-input"
          type="text"
          ref={recepientAddressRef}
        />
      </div>
      <div className="token-box">
        <div className="token-select-box-wrapper">
          <Dropdown
            width="100%"
            onSelected={props.setTransferredToken}
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
                  {/* {shortenAddress(transferredToken)} (
                  {TOKEN_CURRENCY_MAP[transferredToken]}) */}
                  ETH
                </div>
              </div>
            }
            renderItem={item => {
              return (
                <div className="item-name-inner">
                  <div className="l2-token-img-bg">
                    <img
                      className="l2-token-img"
                      src="../ethereum-icon.png"
                      alt="Ethereum Logo"
                    ></img>
                  </div>
                  <div className="token-name">{item.name}</div>
                </div>
              )
            }}
            items={tokenBalanceList.map(({ tokenAddress }) => ({
              // name: shortenAddress(tokenAddress),
              name: 'ETH',
              value: tokenAddress
            }))}
          />
        </div>
        <div className="amount-box">
          <input className="amount-input" type="number" ref={amountRef} />
          <span className="sent-amount-in-usd">
            ={props.ETHtoUSD * amountRef} USD
          </span>
        </div>
        <div className="current-balance-box">
          <span className="current-balance-number">/1.2</span>
          <span className="your-current-balance">(your current balance)</span>
        </div>
      </div>
      <div className="send-button">
        <PrimaryButton
          onClick={e => {
            props.setTransferredAmount(Number(amountRef.current.value))
            props.setRecepientAddress(recepientAddressRef.current.value)
            e.preventDefault()
            const href = `${router.route}?transfer`
            router.push(href, href, { shallow: true })
          }}
        >
          Send
        </PrimaryButton>
      </div>

      <style jsx>{`
        .send-section {
          width: calc(100% - 40px);
          display: flex;
          flex-direction: column;
          padding: 20px;
          margin: 20px 0px;
          background-color: ${SECTION_BACKGROUND};
          position: relative;
        }
        .address-box {
          margin-top: 20px;
        }
        .address-title {
          font-size: ${SMALL};
          font-weight: 800;
          color: ${SUBTEXT};
        }
        .recepient-address-input {
          width: 683px;
          height: 40px;
          padding: 4px;
          font-size: ${SMALL};
          color: ${SUBTEXT};
          background-color: transparent;
          border: 1px solid ${BORDER};
          border-width: 0 0 1px;
        }

        .token-box {
          margin-top: 16px;
          display: flex;
        }
        .token-select-box-wrapper {
          width: 128px;
          height: 48px;
          background-color: ${BACKGROUND};
          border-radius: 4px;
          display: flex;
          align-items: center;
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
        .token-select-box-wrapper :global(.dropdown-content) {
          left: -7px;
          top: calc(100% - 0.5rem);
          width: 144px;
        }
        .item-name-inner {
          width: 100%;
          padding: 8px 32px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
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
        .amount-box {
          margin-left: 10px;
          display: flex;
          flex-direction: column;
        }
        .amount-input {
          height: 47px;
          width: 85px;
          padding: 4px;
          font-size: ${XLARGE};
          font-weight: ${NORMAL};
          color: white;
          border-radius: 4px;
          background-color: ${BACKGROUND};
          border: none;
        }
        .sent-amount-in-usd {
          margin-top: 8px;
          margin-left: 4px;
          color: ${SUBTEXT};
        }
        .current-balance-box {
          height: 47px;
          display: flex;
          align-items: center;
          margin-left: 10px;
          color: ${SUBTEXT};
        }
        .current-balance-number {
          font-size: ${XLARGE};
          font-weight: ${NORMAL};
        }
        .your-current-balance {
          margin-left: 4px;
          margin-top: 7px;
          font-size: ${MEDIUM};
          font-weight: ${NORMAL};
        }
        .send-button {
          position: absolute;
          bottom: 25px;
          right: 20px;
        }
      `}</style>
    </div>
  )
}

const mapStateToProps = state => ({
  address: state.address,
  tokenBalanceList: state.balance.tokenBalanceList,
  ETHtoUSD: state.balance.ETHtoUSD,
  transferredToken: state.transferState.transferredToken,
  transferredAmount: state.transferState.transferredAmount,
  recepientAddress: state.transferState.recepientAddress
})

const mapDispatchToProps = {
  getBalance,
  getETHtoUSD,
  setTransferredToken,
  setTransferredAmount,
  setRecepientAddress
}
export default connect(mapStateToProps, mapDispatchToProps)(Send)
