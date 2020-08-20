import { useEffect } from 'react'
import { connect } from 'react-redux'
import { ActionType } from '@cryptoeconomicslab/plasma-light-client'
import TransactionHistoryIcon from './TransactionHistoryIcon'
import TransactionHistoryMessage from './TransactionHistoryMessage'
import clientWrapper from '../client'
import { TEXT, SUBTEXT } from '../constants/colors'
import { FZ_SMALL, FW_BOLD, FZ_MEDIUM } from '../constants/fonts'
import { SYNCING_STATUS } from '../store/appStatus'
import { getTransactionHistories } from '../store/transactionHistory'

const BlockExplorerLinkWrapper = ({ history, children }) => {
  return (
    <div className="transaction__link-wrapper">
      {history.message === ActionType.Send ||
      history.message === ActionType.Receive ? (
        <a
          href={`${process.env.BLOCK_EXPLORER_URL}/transaction?blockNumber=${history.blockNumber}&depositContractAddress=${history.depositContractAddress}&start=${history.range.start}&end=${history.range.end}`}
          className="transaction__link"
          target="_blank"
          rel="noopener"
        >
          {children}
        </a>
      ) : (
        <>{children}</>
      )}
      <style jsx>{`
        .transaction__link-wrapper {
          display: flex;
          width: 100%;
        }
        .transaction__link {
          color: ${TEXT};
          text-decoration: none;
          display: flex;
          width: 100%;
        }
        .transaction__link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}

const TransactionHistory = ({
  historyList,
  syncingStatus,
  getTransactionHistories
}) => {
  useEffect(() => {
    if (syncingStatus === SYNCING_STATUS.LOADED) {
      getTransactionHistories()
    }
  }, [])

  return (
    <ul>
      {historyList.length > 0 ? (
        <>
          {historyList.map((history, i) => (
            <li
              className="transaction"
              key={`${i}-${history.message}-${history.amount}-${history.unit}-${history.blockNumber}-${history.counterParty}`}
            >
              <div className="transaction__item transaction__item--icon">
                <TransactionHistoryIcon history={history} />
              </div>
              <BlockExplorerLinkWrapper history={history}>
                <div className="transaction__item transaction__item--amount">
                  {history.amount} {history.unit}
                </div>
                <div className="transaction__item transaction__item--message">
                  <TransactionHistoryMessage history={history} />
                </div>
                <div className="transaction__item transaction__item--time">
                  at {history.blockNumber} block
                </div>
              </BlockExplorerLinkWrapper>
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
