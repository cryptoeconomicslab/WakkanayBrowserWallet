import React from 'react'
import { connect } from 'react-redux'
import TransactionHistoryIcon from './TransactionHistoryIcon'
import TransactionHistoryMessage from './TransactionHistoryMessage'
import { SUBTEXT } from '../constants/colors'
import { FZ_SMALL, FW_BOLD, FZ_MEDIUM } from '../constants/fonts'
import {
  getTransactionHistories,
  TransactionHistory as TransactionHistoryItem
} from '../store/transactionHistory'

type Props = {
  historyList: TransactionHistoryItem[]
}

const TransactionHistory = ({ historyList }: Props) => {
  return (
    <ul>
      {historyList.length > 0 ? (
        <>
          {historyList.map((history: TransactionHistoryItem, i: number) => (
            // TODO: add Block Explorer link
            <li
              className="transaction"
              key={`${i}-${history.message}-${history.amount}-${history.unit}-${history.blockNumber}-${history.counterParty}`}
            >
              <div className="transaction__item transaction__item--icon">
                <TransactionHistoryIcon history={history} />
              </div>
              <div className="transaction__item transaction__item--amount">
                {history.amount} {history.unit}
              </div>
              <div className="transaction__item transaction__item--message">
                <TransactionHistoryMessage history={history} />
              </div>
              <div className="transaction__item transaction__item--time">
                at {history.blockNumber} block
              </div>
            </li>
          ))}
        </>
      ) : (
        <li className="transaction">
          Your transaction history does not exist.
        </li>
      )}
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

const mapStateToProps = ({ appStatus, history }) => ({
  syncingStatus: appStatus.syncingStatus,
  historyList: history.historyList
})
const mapDispatchToProps = {
  getTransactionHistories
}
export default connect(mapStateToProps, mapDispatchToProps)(TransactionHistory)
