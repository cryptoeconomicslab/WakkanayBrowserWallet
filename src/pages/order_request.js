import Layout from '../components/Layout'

//react-font-awesome import
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowsAltH } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add(faArrowsAltH)

export default function OrderRequest() {
  return (
    <Layout>
      <div className="order-request-page">
        <div className="exchange-order-request-title-box">
          Exchange Order Request
        </div>
        <div className="exchange-order-request-box">
          <div className="token-box-left">
            <div className="action-title">Pay:</div>
            <img
              className="token-image"
              src="../ethereum-icon.png"
              alt="Ethereum Icon"
            ></img>
            <div className="amount-content">
              <div className="amount-box">
                <input className="amount-input" type="number"></input>
                <div className="token-type">ETH ▽</div>
              </div>
              <div className="amount-in-usd">$9.33 USD</div>
            </div>
            <div className="insufficient-fund">Insufficient Fund</div>
          </div>
          <div className="arrow">
            <FontAwesomeIcon icon="arrows-alt-h" />
          </div>
          <div className="token-box-right">
            <div className="action-title">Receive:</div>
            <img
              className="token-image"
              src="../dai-icon.png"
              alt="Dai Icon"
            ></img>
            <div className="amount-content">
              <div className="amount-box">
                <input className="amount-input"></input>
                <div className="token-type">DAI ▽</div>
              </div>
              <div className="amount-in-usd">$9.33 USD</div>
            </div>
            <div className="insufficient-fund">Insufficient Fund</div>
          </div>
        </div>
        <div className="expected-balance-box">
          <div className="expected-balance-title">Expected New Balance</div>
          <div className="expected-balance-contents">
            <div className="token-expected-balance-box-left">
              <div className="token-new-amount">
                <div className="token-new-amount-in-eth">
                  <span className="token-new-amount-text">1.05</span>
                  <span className="token-type-unit">ETH</span>
                </div>
                <div className="token-new-amount-in-usd">$215.18 USD</div>
              </div>
              <div className="token-paying-diff">▼ 0.05ETH</div>
            </div>
            <div className="token-expected-balance-box-right">
              <div className="token-new-amount">
                <div className="token-new-amount-in-eth">
                  <span className="token-new-amount-text">70</span>
                  <span className="token-type-unit">DAI</span>
                </div>
                <div className="token-new-amount-in-usd">$70 USD</div>
              </div>
              <div className="token-receiving-diff">▲ 9.33DAI</div>
            </div>
          </div>
        </div>
        <div className="cancel-confirm-buttons">
          <div className="cancel-button">
            <a className="cancel">Cancel</a>
          </div>
          <div className="confirm-button">
            <a className="confirm">Confirm</a>
          </div>
        </div>
      </div>
      <style jsx>{`
        .order-request-page {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .exchange-order-request-title-box {
          margin-top: 24px;
          font-weight: 700;
          font-size: 28px;
        }
        .exchange-order-request-box {
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }
        .token-box-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-top: 20px;
          margin-right: 16px;
          padding: 8px;
          border: solid 2px #b1c6f7;
          border-radius: 6px;
          box-shadow: 0 1px 3px rgba(60, 64, 67, 0.3),
            0 4px 8px 3px rgba(60, 64, 67, 0.15);
        }
        .token-box-right {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-top: 20px;
          margin-left: 16px;
          padding: 8px;
          border: solid 2px #b1c6f7;
          border-radius: 6px;
          box-shadow: 0 1px 3px rgba(60, 64, 67, 0.3),
            0 4px 8px 3px rgba(60, 64, 67, 0.15);
        }
        .action-title {
          font-weight: 640;
          font-size: 20px;
        }
        .token-image {
          width: 60px;
          height: 98px;
          margin-top: 8px;
        }
        .amount-box {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .amount-input {
          font-size: 16px;
          margin-top: 12px;
          margin-right: 4px;
          height: 28px;
          width: 76px;
          border-bottom: solid 2px lightgray;
          border-right: none;
          border-left: none;
          border-top: none;
        }
        .token-type {
          font-size: 14px;
          margin-top: 12px;
          margin-left: 4px;
        }
        .amount-in-usd {
          font-size: 13px;
          color: darkgray;
          font-weight: 640;
        }
        .insufficient-fund {
          width: 100%;
          color: red;
          font-size: 13px;
        }
        .arrow {
          font-size: 28px;
          margin: 100px 8px;
        }
        .expected-balance-box {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border: dashed 2px #b1c6f7;
          padding: 10px 18px;
          margin-top: 28px;
          border-radius: 6px;
        }
        .expected-balance-title {
          font-size: 18px;
          width: 100%;
        }
        .expected-balance-contents {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
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
          font-size: 24px;
          font-weight: 680;
        }
        .token-type-unit {
          font-size: 13px;
          margin-left: 6px;
        }
        .token-new-amount-in-usd {
          font-size: 13px;
          font-weight: 640;
          color: darkgray;
        }
        .token-paying-diff {
          font-size: 12px;
          margin-left: 5px;
          color: red;
        }
        .token-receiving-diff {
          font-size: 12px;
          margin-left: 5px;
          color: green;
        }
        .cancel-confirm-buttons {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 40px;
          margin-top: 28px;
          width: inherit;
          border-radius: 6px;
        }
        .cancel-button,
        .confirm-button {
          padding: 6px 0px;
          border: solid gray 2px;
          width: 108px;
          text-align: center;
          background-color: white;
          border-radius: 6px;
        }
        .cancel-button {
          margin-right: 24px;
        }
        .confirm-buttom {
          margin-left: 8px;
        }
        .cancel,
        .confirm {
          font-size: smaller;
          font-weight: 680;
        }
      `}</style>
    </Layout>
  )
}
