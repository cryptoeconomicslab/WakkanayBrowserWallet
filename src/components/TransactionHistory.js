import { connect } from 'react-redux'
import { ActionType } from '@cryptoeconomicslab/plasma-light-client'
import { TEXT, SUBTEXT } from '../constants/colors'
import { FZ_SMALL, FW_BOLD, FZ_MEDIUM } from '../constants/fonts'
import { getTransactionHistories } from '../store/transaction_history'
import { shortenAddress } from '../utils'

const Message = ({ message, counterParty }) => {
  if (message === ActionType.Send) {
    return <>{`${message} to ${shortenAddress(counterParty)}`}</>
  } else if (message === ActionType.Receive) {
    return <>{`${message} from ${shortenAddress(counterParty)}`}</>
  } else {
    return <>{message}</>
  }
}

const TransactionHistory = ({ historyList }) => {
  return (
    <ul>
      {historyList.map(
        (
          {
            message,
            amount,
            unit,
            blockNumber,
            counterParty,
            depositContractAddress,
            range
          },
          i
        ) => (
          <li
            className="transaction"
            key={`${i}-${message}-${amount}-${unit}-${blockNumber}-${counterParty}`}
          >
            <a
              href={`${process.env.BLOCK_EXPLORER_URL}/transaction?blockNumber=${blockNumber}&depositContractAddress=${depositContractAddress}&start=${range.start}&end=${range.end}`}
              className="transaction__link"
              target="_blank"
              rel="noopener"
            >
              <div className="transaction__item transaction__item--icon">
                <img src={`/icon-${message}.svg`} />
              </div>
              <div className="transaction__item transaction__item--amount">
                {amount} {unit}
              </div>
              <div className="transaction__item transaction__item--type">
                <Message message={message} counterParty={counterParty} />
              </div>
              <div className="transaction__item transaction__item--time">
                at {blockNumber} block
              </div>
            </a>
          </li>
        )
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
          margin-top: 1rem;
        }
        .transaction__link {
          display: flex;
          width: 100%;
          color: ${TEXT};
          text-decoration: none;
        }
        .transaction__link:hover {
          text-decoration: underline;
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
