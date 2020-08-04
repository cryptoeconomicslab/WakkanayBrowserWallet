import { connect } from 'react-redux'
import TransactionHistoryMessage from './TransactionHistoryMessage'
import { SUBTEXT } from '../constants/colors'
import { FZ_SMALL, FW_BOLD, FZ_MEDIUM } from '../constants/fonts'
import TransactionHistoryIcon from './TransactionHistoryIcon'

const TransactionHistory = ({ pendingExitList, historyList }) => {
  return (
    <ul>
      {historyList.map((history, i) => (
        <li
          className="transaction"
          key={`${i}-${history.message}-${history.amount}-${history.unit}-${history.blockNumber}-${history.counterParty}`}
        >
          <div className="transaction__item transaction__item--icon">
            <TransactionHistoryIcon
              pendingExitList={pendingExitList}
              history={history}
            />
          </div>
          <div className="transaction__item transaction__item--amount">
            {history.amount} {history.unit}
          </div>
          <div className="transaction__item transaction__item--message">
            <TransactionHistoryMessage
              pendingExitList={pendingExitList}
              history={history}
            />
          </div>
          <div className="transaction__item transaction__item--time">
            at {history.blockNumber} block
          </div>
        </li>
      ))}
      <style jsx>{`
        .transaction {
          list-style-type: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: ${FZ_MEDIUM};
          font-weight: ${FW_BOLD};
        }
        .transaction + .transaction {
          margin-top: 0.5rem;
        }
        .transaction__item {
          flex: 1;
        }
        .transaction__item--date {
          padding-bottom: 0.25rem;
        }
        .transaction__item--icon {
          flex: 0;
          flex-basis: 3.25rem;
          text-align: left;
          display: flex;
          align-items: center;
        }
        .transaction__item--amount {
          flex: 0;
          flex-basis: 6rem;
        }
        .transaction__item--time {
          font-size: ${FZ_SMALL};
          color: ${SUBTEXT};
          flex: 0;
          flex-basis: 8rem;
          text-align: right;
          padding-right: 1rem;
        }
      `}</style>
    </ul>
  )
}

const mapStateToProps = ({ pendingExitList, history }) => ({
  pendingExitList: pendingExitList.items,
  historyList: history.historyList
})
export default connect(mapStateToProps)(TransactionHistory)
