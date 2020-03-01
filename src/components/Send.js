import React, { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { connect } from 'react-redux'

//react-font-awesome import
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
library.add(faSignOutAlt)

//redux
import {
  setTransferredToken,
  setTransferredAmount,
  setRecepientAddress
} from '../store/transfer'

//internal import
import { shortenAddress, TOKEN_CURRENCY_MAP } from '../utils'
import Dropdown from './Dropdown'
import { PrimaryButton } from './PrimaryButton'
import { SectionTitle } from '../components/SectionTitle'
import { TokenSelectButton } from './TokenSelectButton'
import { NORMAL, SMALL, MEDIUM, XLARGE } from '../fonts'
import { SUBTEXT, BACKGROUND, SECTION_BACKGROUND, BORDER } from '../colors'

const Send = props => {
  const router = useRouter()
  const recepientAddressRef = useRef('')
  const [tokenAmount, setTokenAmount] = useState(0)
  const amountInput = useRef('')

  const tokenBalance = props.tokenBalanceList.find(
    ({ tokenAddress }) => tokenAddress === props.transferredToken
  )

  return (
    <div className="send-section" id="send">
      <SectionTitle>Send Token</SectionTitle>
      <div className="address-box">
        <div className="address-title">Address</div>
        <input
          placeholder={'0x00000000000'}
          className="recepient-address-input"
          type="text"
          ref={recepientAddressRef}
          value={router.query.address}
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
                    src="../tokenIcons/ethereum-logo.png"
                    alt="Ethereum Logo"
                  ></img>
                </div>
                <div className="token-name">
                  {/* {shortenAddress(props.transferredToken)} (
                  {TOKEN_CURRENCY_MAP[props.transferredToken]}) */}
                  ETH
                </div>
              </div>
            }
            items={props.tokenBalanceList.map(({ tokenAddress }) => ({
              // name: shortenAddress(tokenAddress),
              name: 'ETH',
              value: tokenAddress
            }))}
            renderItem={item => (
              <TokenSelectButton item={item} padding="32px" />
            )}
          />
        </div>
        <div className="amount-box">
          <input
            className="amount-input"
            type="number"
            ref={amountInput}
            onChange={e => {
              setTokenAmount(Number(e.target.value))
            }}
          />
          <span className="sent-amount-in-usd">
            = {Math.round(props.ETHtoUSD * tokenAmount * 100) / 100} USD
          </span>
        </div>
        <div className="current-balance-box">
          <span className="current-balance-number">
            /{tokenBalance ? tokenBalance.amount : ''}
          </span>
          <span className="your-current-balance">(your current balance)</span>
        </div>
      </div>
      <div className="send-button">
        <PrimaryButton
          onClick={e => {
            props.setTransferredAmount(tokenAmount)
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
  setTransferredToken,
  setTransferredAmount,
  setRecepientAddress
}
export default connect(mapStateToProps, mapDispatchToProps)(Send)
