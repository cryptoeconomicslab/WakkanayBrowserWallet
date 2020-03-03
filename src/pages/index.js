import React, { useRef } from 'react'
import { useRouter } from 'next/router'
import classNames from 'classnames'

// internal import
import Layout from '../components/Layout'
import AddressListItem from '../components/AddressListItem'
import { SectionTitle } from '../components/SectionTitle'
import { PrimaryButton } from '../components/PrimaryButton'
import { shortenAddress, roundBalance } from '../utils'
import {
  BOLD,
  EXTRABOLD,
  XSMALL,
  SMALLER,
  SMALL,
  LARGER,
  XLARGE,
  XXSMALL,
  MEDIUM,
  SMALLPLUS
} from '../fonts'
import {
  SUBTEXT,
  BORDER,
  SECTION_BACKGROUND,
  BORDER_DARK,
  PRIMARY_BUTTON_TEXT,
  White
} from '../colors'

//redux
import { connect } from 'react-redux'
import {
  registerAddressListItem,
  editAddressListItem,
  removeAddressListItem
} from '../store/address_list_item'
import {
  setEditedAddress,
  setEditedName
} from '../store/edited_address_list_item.js'
import { getAddress } from '../store/address'
import { setTransferredToken } from '../store/transfer'

// clipboard
import { CopyToClipboard } from 'react-copy-to-clipboard'
import ReactTooltip from 'react-tooltip'

//react-font-awesome import
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faClipboard,
  faUserPlus,
  faPen,
  faTrash,
  faBookOpen
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add(faClipboard, faUserPlus, faPen, faTrash, faBookOpen)

const Home = props => {
  const router = useRouter()
  const nameInput = useRef('')
  const addressInput = useRef('')
  const editedNameRef = useRef('')
  const editedAddressRef = useRef('')

  const onKeyDown = event => {
    if (event.key === 'Enter') {
      event.preventDefault()
      event.stopPropagation()
      if (nameInput.current.value !== '' && addressInput.current.value !== '') {
        props.registerAddressListItem({
          id: `${Date.now()}`,
          name: nameInput.current.value,
          address: addressInput.current.value
        })
      }
      return (nameInput.current.value = ''), (addressInput.current.value = '')
    }
  }

  return (
    <Layout>
      <div className="l1-account-box-wrapper" id="l1-account">
        <div className="l1-account-box">
          <div className="user-address-info-box">
            <div className="user-info-bar">
              <span className="account-name">yuriko.eth</span>
              <CopyToClipboard text={props.address}>
                <div className="account-address-set" data-tip="React-tooltip">
                  <div className="account-address">
                    {shortenAddress(props.address)}
                  </div>
                  <button className="copy-button">
                    <FontAwesomeIcon icon="clipboard" />
                  </button>
                </div>
              </CopyToClipboard>
              <ReactTooltip place="bottom" type="dark" effect="solid">
                <span>Copy to Clipboard</span>
              </ReactTooltip>
            </div>
          </div>
          <div className="total-balance-title">L1 Total </div>
          <div className="total-balance">450.34 $</div>
          <div className="deposit-button">
            <PrimaryButton
              onClick={e => {
                e.preventDefault()
                const href = `${router.route}?deposit`
                router.push(href, href, { shallow: true })
              }}
            >
              Deposit
            </PrimaryButton>
          </div>
        </div>
      </div>
      <div className="l2-token-box-wrapper" id="l2-tokens">
        <SectionTitle>L2 Tokens</SectionTitle>
        <div className="l2-token-box-list">
          {props.tokenBalanceList.map(({ tokenAddress, amount }) => {
            return (
              <div className="l2-token-box">
                <div className="balance-board">
                  <div className="l2-token-img-bg">
                    <img
                      className="l2-token-img"
                      src="../tokenIcons/ethereum-logo.png"
                      alt="Ethereum Logo"
                    ></img>
                  </div>
                  <div className="token-balance-unit">ETH</div>
                  <div className="token-balance-number">{amount}</div>
                  <hr className="line"></hr>
                  <div className="balance-in-usd">
                    {roundBalance(props.ETHtoUSD, amount)} USD
                  </div>
                </div>
                <div className="token-buttons-container">
                  <button
                    className="token-button"
                    onClick={e => {
                      e.preventDefault()
                      const href = `${router.route}?withdraw`
                      router.push(href, href, { shallow: true })
                    }}
                  >
                    Withdraw
                  </button>
                  <div className="slash" />
                  <button
                    className={classNames('token-button', 'send-button')}
                    onClick={() => {
                      props.setTransferredToken(tokenAddress)
                      router.push('/payment')
                    }}
                  >
                    Send
                  </button>
                  <button
                    className={classNames('token-button', 'exchange-button')}
                    onClick={() => {
                      router.push('/exchange')
                    }}
                  >
                    Exchange
                  </button>
                </div>
              </div>
            )
          })}
        </div>
        <hr className="l2-token-total-balance-line"></hr>
        <div className="l2-token-total-balance-wrapper">
          <div className="l2-token-total-balance-title">Total</div>
          <div className="l2-token-total-balance">USD 450.3</div>
        </div>
      </div>
      <div className="address-book-wrapper" id="address-book">
        <div className="address-book-title-box">
          <SectionTitle>Address Book</SectionTitle>
        </div>
        <div className="address-book-table">
          <div className="column-titles">
            <div className="name-column">NAME</div>
            <div className="address-column">ADDRESS</div>
          </div>
          {props.addressList.map(addressListItem => (
            <div className="address-book-item">
              <AddressListItem
                addressListItem={addressListItem}
                editAddressListItem={props.editAddressListItem}
                setEditedName={props.setEditedName}
                setEditedAddress={props.setEditedAddress}
                removeAddressListItem={props.removeAddressListItem}
                editedNameRef={editedNameRef}
                editedAddressRef={editedAddressRef}
                editedName={props.editedAddressListItem.name}
                editedAddress={props.editedAddressListItem.address}
              />
            </div>
          ))}
          <div className="address-book-new-item">
            <div className="new-item-inputs">
              <input
                className={classNames('address-name-input', 'name-input')}
                type="text"
                ref={nameInput}
                placeholder="NAME"
                onKeyDown={onKeyDown}
              />
              <input
                className={classNames('address-name-input', 'address-input')}
                type="text"
                ref={addressInput}
                placeholder="ADDRESS"
                onKeyDown={onKeyDown}
              />
            </div>
            <button
              className="add-button"
              onClick={() => {
                if (
                  nameInput.current.value !== '' &&
                  addressInput.current.value !== ''
                ) {
                  props.registerAddressListItem({
                    id: `${Date.now()}`,
                    name: nameInput.current.value,
                    address: addressInput.current.value
                  })
                }
                return (
                  (nameInput.current.value = ''),
                  (addressInput.current.value = '')
                )
              }}
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .l1-account-box-wrapper {
          width: 100%;
        }
        .l1-account-box {
          background-color: ${SECTION_BACKGROUND};
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 280px;
          margin: 20px;
        }
        .user-address-info-box {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 8px;
          width: 100%;
          border-bottom: solid 1px black;
        }
        .user-info-bar {
          margin-left: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .account-name {
          margin-top: 4px;
          font-weight: 600;
          font-size: ${SMALLPLUS};
        }
        .account-address-set {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          cursor: pointer;
        }
        .account-address-set:hover {
          background-color: ${BORDER_DARK};
        }
        .account-address {
          color: ${SUBTEXT};
          font-size: ${SMALLER};
          font-weight: 500;
        }
        .copy-button {
          font-size: ${XXSMALL};
          margin-left: 4px;
          border: none;
          background: transparent;
          color: ${SUBTEXT};
        }
        .total-balance-title {
          font-size: ${MEDIUM};
          font-weight: 100;
          margin-top: 20px;
          margin-bottom: 14px;
        }
        .total-balance {
          font-size: ${XLARGE};
          font-weight: 200;
        }
        .deposit-button {
          border: none;
          margin-top: 12px;
          margin-bottom: 20px;
        }
        .l2-token-box-wrapper {
          width: 100%;
          display: flex;
          flex-direction: column;
          padding: 20px;
          margin-top: 20px;
        }
        .l2-token-box-list {
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          overflow-y: scroll;
        }
        .l2-token-box {
          padding: 12px;
          background-color: ${SECTION_BACKGROUND};
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .balance-board {
          display: flex;
          justify-content: center;
          align-items: center;
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
        .token-balance-unit {
          margin-left: 16px;
          font-size: ${SMALL};
          font-weight: 650;
        }
        .token-balance-number {
          margin-left: 12px;
          font-size: ${LARGER};
          font-weight: 500;
        }
        .line {
          margin-left: 24px;
          width: 11px;
          border: 1px solid ${BORDER};
        }
        .balance-in-usd {
          margin-left: 12px;
          color: ${SUBTEXT};
          font-size: ${SMALLER};
          font-weight: 650;
        }
        .token-buttons-container {
          display: flex;
          align-items: center;
        }
        .token-button {
          border: none;
          border-radius: 40px;
          width: 93px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: ${White(0.06)};
          color: ${PRIMARY_BUTTON_TEXT};
          cursor: pointer;
          font-size: ${SMALLER};
          font-weight: ${EXTRABOLD};
        }
        .slash {
          margin-left: 17px;
          width: 11px;
          height: 25px;
          position: relative;
        }
        .slash:after {
          content: '';
          position: absolute;
          left: 10px;
          border: 1px solid ${BORDER_DARK};
          width: 26px;
          transform: rotate(110deg);
          transform-origin: 0% 0%;
        }
        .send-button {
          margin-left: 19px;
        }
        .send-button:hover {
          background-color: #eb3959;
        }
        .exchange-button {
          margin-left: 10px;
        }
        .exchange-button:hover {
          background-color: #4e3ff4;
        }
        .l2-token-total-balance-line {
          border: none;
          margin-top: 12px;
          width: 100%;
          height: 3px;
          background-color: ${BORDER};
        }
        .l2-token-total-balance-wrapper {
          color: ${SUBTEXT};
          margin-top: 4px;
          font-size: ${SMALLPLUS};
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
        .l2-token-total-balance {
          margin-left: 20px;
        }
        .address-book-wrapper {
          width: 100%;
          display: flex;
          flex-direction: column;
          padding: 20px;
          margin: 20px 0px;
        }
        .address-book-title-box {
          display: flex;
          align-items: center;
        }
        .address-book-table {
          margin-top: 30px;
          display: flex;
          flex-direction: column;
          font-size: ${XSMALL};
          font-weight: ${BOLD};
        }
        .column-titles {
          color: ${White(0.5)};
          display: flex;
          align-items: center;
          padding-bottom: 12px;
          margin-bottom: 12px;
          border-bottom: 1px solid ${BORDER_DARK};
        }
        .name-column {
          width: 100px;
        }
        .address-column {
          width: calc(100% - 100px);
          padding-left: 12px;
        }
        .address-book-item {
          color: ${White(0.7)};
          margin-top: 4px;
        }
        .address-book-new-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 4px;
          color: ${White(0.7)};
        }
        .new-item-inputs {
          width: calc(100% - 87px);
          display: flex;
          border-bottom: 1px solid ${BORDER_DARK};
        }
        .new-item-inputs:focus-within {
          border-bottom: 1px solid #2baef8;
        }
        .address-name-input {
          margin-bottom: 12px;
          background-color: transparent;
          font-size: ${XSMALL};
          font-weight: ${BOLD};
          color: ${BORDER_DARK};
        }
        .address-name-input::placeholder {
          font-size: ${XSMALL};
          font-weight: ${BOLD};
          color: ${BORDER_DARK};
        }
        .name-input:focus + .address-input {
          border-left: 1px solid #2baef8;
        }
        .name-input {
          width: 100px;
        }
        .address-input {
          border-left: 1px solid ${BORDER_DARK};
          width: calc(100% - 100px);
          padding-left: 12px;
        }
        .address-input:focus {
          border-left: 1px solid #2baef8;
        }
        .add-button {
          border-radius: 40px;
          margin-left: 18px;
          width: 87px;
          height: 36px;
          background: linear-gradient(122.3deg, #ec8383 0.21%, #c13087 93.55%);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: ${EXTRABOLD};
          font-size: ${SMALLER};
          color: ${PRIMARY_BUTTON_TEXT};
        }
      `}</style>
    </Layout>
  )
}

const mapStateToProps = state => ({
  tokenBalanceList: state.balance.tokenBalanceList,
  ETHtoUSD: state.balance.ETHtoUSD,
  address: state.address,
  addressList: state.addressList,
  editedAddressListItem: state.editedAddressListItem
})

const mapDispatchToProps = {
  registerAddressListItem,
  editAddressListItem,
  removeAddressListItem,
  setEditedAddress,
  setEditedName,
  getAddress,
  setTransferredToken
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
