import { connect } from 'react-redux'
import { setFilter } from '../store/transaction_history'
import Dropdown from './Dropdown'
import { SUBTEXT, TEXT, BORDER, BORDER_DARK, White, Black } from '../colors'

const TransactionHistory = props => {
  const currentFilter = props.currentFilter
  return (
    <div className="block-explorer-page">
      <h2 className="transaction-hisotry-title">Transaction History</h2>
      <div className="search-box-wrapper">
        <div className="search-box">
          <div className="filter">
            <Dropdown
              onSelected={props.setFilter}
              buttonName={currentFilter}
              items={[
                { name: 'Filter', value: 'Filter' },
                { name: 'Address', value: 'Address' },
                { name: 'Token', value: 'Token' },
                { name: 'ENS', value: 'ENS' },
                { name: 'Block #', value: 'Block #' },
                { name: 'Range', value: 'Range' }
              ]}
            />
          </div>
          <input
            className="search-input"
            type="text"
            placeholder="Seach address, ENS, token, block height"
          ></input>
        </div>
        <div className="search-button">Search</div>
      </div>
      <div className="transaction-history-scroll">
        <div className="transaction-histories">
          {Array.from(Array(15)).map((val, i) => (
            <div className="transaction-history" key={i}>
              <div className="transaction-date">Nov {15 - i}, 2019</div>
              <div className="history-container">
                <li className="transaction">
                  <img
                    className="transaction__item transaction-icon"
                    src="/icon-sent.svg"
                  />
                  <div className="transaction__item transaction-amount">
                    0.05 ETH
                  </div>
                  <div className="transaction__item transaction-type">Sent</div>
                  <div className="transaction__item transaction-time">
                    08:21
                  </div>
                </li>
                <li className="transaction">
                  <img
                    className="transaction__item transaction-icon"
                    src="/icon-receive.svg"
                  />
                  <div className="transaction__item transaction-amount">
                    0.07 ETH
                  </div>
                  <div className="transaction__item transaction-type">
                    Receive
                  </div>
                  <div className="transaction__item transaction-time">
                    07:10
                  </div>
                </li>
                <li className="transaction">
                  <img
                    className="transaction__item transaction-icon"
                    src="/icon-exchange.svg"
                  />
                  <div className="transaction__item transaction-amount">
                    0.02 ETH
                  </div>
                  <div className="transaction__item transaction-type">
                    Exchange with DAI
                  </div>
                  <div className="transaction__item transaction-time">
                    06:07
                  </div>
                </li>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .block-explorer-page {
          padding: 1.5rem;
        }
        .transaction-history-scroll {
          overflow-y: scroll;
          height: calc(100vh - 7.5rem);
        }
        .transaction-hisotry-title {
          color: ${White(0.75)};
          font-size: 1.25rem;
          font-weight: 300;
          margin-bottom: 1rem;
        }
        .search-box-wrapper {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          width: 100%;
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
        }
        .filter {
          flex-basis: 6rem;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 2rem;
        }
        .filter :global(.dropdown) {
          position: relative;
          flex: 1;
          border-right: 1px solid ${BORDER};
        }
        .filter :global(.dropdown-button) {
          font-size: 0.875rem;
          font-weight: 500;
          padding-right: 0.75rem;
        }
        .filter :global(.dropdown-item) {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          cursor: pointer;
          padding: 0.5rem 0;
        }
        .filter :global(.dropdown-item) + :global(.dropdown-item) {
          border-top: solid 1px ${BORDER_DARK};
        }
        .search-box {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          border-radius: 2rem;
          border: 1px solid ${BORDER};
        }
        .search-input {
          flex: 1;
          padding: 8px;
          border: none;
          color: white;
          width: 100%;
          background: transparent;
          outline: none;
          font-size: 0.8125rem;
        }
        .search-input::placeholder {
          color: ${White(0.15)};
        }
        .search-button {
          padding: 0.4375rem 0;
          flex-basis: 6rem;
          margin-left: 0.5rem;
          text-align: center;
          border: 1px solid ${BORDER};
          border-radius: 2rem;
          cursor: pointer;
        }
        .search-button:hover {
          background: ${White(0.05)};
        }
        .transaction-history {
          margin-bottom: 2rem;
        }
        .transaction-date {
          font-size: 0.8125rem;
          color: ${SUBTEXT};
          border-bottom: 1px solid ${BORDER_DARK};
          padding-bottom: 0.25rem;
        }
        .transaction {
          list-style-type: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          color: ${SUBTEXT};
          font-size: 0.8125rem;
          font-weight: 300;
        }
        .transaction__item {
          flex: 1;
        }
        .transaction-icon {
          flex: 0;
          flex-basis: 1rem;
          padding-right: 1rem;
        }
        .transaction-amount {
          flex: 0;
          flex-basis: 5rem;
        }
        .transaction-time {
          flex: 0;
          flex-basis: 4rem;
          text-align: right;
          padding-right: 1rem;
        }
      `}</style>
    </div>
  )
}

const mapStateToProps = state => ({
  currentFilter: state.currentFilter
})

const mapDispatchToProps = {
  setFilter
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionHistory)
