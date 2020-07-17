import { connect } from 'react-redux'
import { SUBTEXT } from '../constants/colors'
import { FZ_SMALL, FW_BOLD, FZ_MEDIUM } from '../constants/fonts'
import { getTransactionHistories } from '../store/transactionHistory'

const TransactionHistory = props => {
  return (
    <ul>
      {props.historyList.map(({ message, amount, unit, blockNumber }) => (
        <li className="transaction">
          <div className="transaction__item transaction__item--icon">
            <img src={`/icon-${message}.svg`} />
          </div>
          <div className="transaction__item transaction__item--amount">
            {amount} {unit}
          </div>
          <div className="transaction__item transaction__item--type">
            {message}
          </div>
          <div className="transaction__item transaction__item--time">
            at {blockNumber} block
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
          margin-top: 1rem;
        }
        .transaction__item {
          flex: 1;
        }
        .transaction__item--date {
          padding-bottom: 0.25rem;
        }
        .transaction__item--icon {
          flex: 0;
          flex-basis: 2rem;
          text-align: left;
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

const mapStateToProps = ({ history }) => ({
  historyList: history.historyList
})

const mapDispatchToProps = {
  getTransactionHistories
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionHistory)
