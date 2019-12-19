import { connect } from 'react-redux'

//react-font-awesome import
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add(faSignOutAlt)

const Send = () => {
  return (
    <div>
      <div className="send-section" id="send">
        <div className="send-eth-title-box">
          <div className="send-eth">Send Token</div>
          <div className="send-icon">
            <FontAwesomeIcon icon="sign-out-alt" />
          </div>
        </div>
        <div className="balance-box">
          <div className="your-balance-title">Ethereum Balance</div>
          <div className="balance-board">
            <img
              className="ethereum-logo"
              src="../ethereum-icon.png"
              alt="Ethereum Logo"
            ></img>
            <div className="total-balance-box">
              <span className="total-balance-number">2</span>
              <span className="total-balance-unit">ETH</span>
              <div className="balance-in-usd">$370.34 USD</div>
            </div>
          </div>
        </div>
        <div className="token-box">
          <div className="token-tag">
            <a className="token-title">Token:</a>
          </div>
          <input className="token-input" />
        </div>
        <div className="address-box">
          <div className="address-tag">
            <a className="address-title">Address:</a>
          </div>
          <input className="address-input" />
        </div>
        <div className="amount-box">
          <div className="amount-tag">
            <a className="amount-title">Amount:</a>
          </div>
          <input className="amount-input" type="number" />
          <span className="sent-amount-unit">ETH</span>
          <span className="sent-amount-in-usd">(9.33USD)</span>
        </div>
        <div className="cancel-next-buttons">
          <div className="cancel-button">
            <a className="cancel">Cancel</a>
          </div>
          <div className="next-button">
            <a className="next">Next</a>
          </div>
        </div>
      </div>
      <style jsx>{`
        .send-section {
          width: 452px;
          display: flex;
          flex-direction: column;
          padding: 20px 24px;
          margin-top: 32px;
          margin-bottom: 24px;
          background-color: #fcf7f5;
          border: solid lightgray 2px;
          border-radius: 6px;
        }
        .balance-box {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-top: 16px;
        }
        .your-balance-title {
          font-size: 20px;
          font-weight: 500;
        }
        .ethereum-logo {
          width: 48px;
          margin-right: 16px;
        }
        .balance-board {
          display: flex;
          justify-content: center;
          align-items: center;
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
          font-size: 18px;
          font-weight: 650;
        }
        .send-eth-title-box {
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }
        .send-eth {
          font-size: 28px;
          font-weight: 700;
        }
        .send-icon {
          font-size: 18px;
          margin-left: 8px;
        }
        .token-box {
          margin-top: 16px;
        }
        .address-box,
        .token-box {
          margin-bottom: 8px;
        }
        .amount-box {
          margin-bottom: 16px;
        }
        .address-title,
        .amount-title,
        .token-title {
          font-size: 16px;
          font-weight: 500;
        }
        .address-input,
        .amount-input,
        .token-input {
          padding: 4px;
          border: solid 1px lightgray;
          font-size: 16px;
          border-radius: 6px;
        }
        .address-input {
          width: 400px;
        }
        .sent-amount-unit {
          font-size: 18px;
          font-weight: 650;
          margin: 0px 6px;
        }
        .cancel-next-buttons {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 40px;
          margin-top: 12px;
        }
        .cancel-button,
        .next-button {
          padding: 6px;
          width: 108px;
          text-align: center;
          background-color: #b1c6f7;
          border-radius: 6px;
          font-size: 15px;
          font-weight: 600;
          color: white;
          cursor: pointer;
        }
        .cancel-button {
          margin-right: 24px;
        }
        .receive-section {
          height: 288px;
          display: flex;
          flex-direction: column;
          padding: 20px 24px;
          margin: 24px;
          background-color: #fcf7f5;
          border: solid lightgray 2px;
          border-radius: 6px;
        }
        .receive-eth-title-box {
          display: flex;
          justify-content: flex-start;
          align-items: center;
        }
        .receive-eth {
          font-size: 28px;
          font-weight: 700;
        }
        .receive-icon {
          font-size: 18px;
          margin-left: 8px;
        }
        .address-box {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .address-title {
          font-size: 16px;
          font-weight: 500;
          margin-top: 16px;
          margin-bottom: 2px;
        }
        .address {
          font-size: 15px;
          font-weight: 500;
          color: lightslategray;
        }
        .qr-code-box {
          width: 180px;
        }
      `}</style>
    </div>
  )
}

const mapStateToProps = state => ({
  address: state.address,
  balance: state.balance
})

export default connect(mapStateToProps)(Send)
