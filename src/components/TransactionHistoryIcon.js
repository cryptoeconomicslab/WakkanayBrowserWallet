import { ActionType } from '@cryptoeconomicslab/plasma-light-client'
import ReactTooltip from 'react-tooltip'
import { completeWithdrawal } from '../store/withdraw'
import { findExit } from '../helper/withdrawHelper'
import { MAIN, MAIN_DARK } from '../constants/colors'
import { connect } from 'react-redux'

const TransactionHistoryIcon = ({
  history,
  pendingExitList,
  completeWithdrawal
}) => {
  const iconEl = (
    <>
      <div className="historyIcon__wrap">
        <img
          src={`/icon-${history.message}.svg`}
          className="transaction__item--iconImg"
        />
      </div>
      <style jsx>{`
        .historyIcon__wrap {
          line-height: 0;
          width: 1.75rem;
          height: 1.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </>
  )

  if (history.message !== ActionType.Exit) {
    return iconEl
  }

  const exit = findExit(
    pendingExitList,
    history.blockNumber,
    history.range,
    history.depositContractAddress
  )

  return exit ? (
    <>
      <div
        className="historyIcon__btn"
        data-tip="React-tooltip"
        data-for={`history-icon-btn-${history.message}-${history.amount}-${history.unit}-${history.blockNumber}-${history.counterParty}`}
        onClick={completeWithdrawal(exit)}
      >
        <img src={`/icon-Withdraw.svg`} className="historyIcon__iconImg" />
      </div>
      <ReactTooltip
        id={`history-icon-btn-${history.message}-${history.amount}-${history.unit}-${history.blockNumber}-${history.counterParty}`}
        place="left"
        type="dark"
        effect="solid"
      >
        <span className="tooltip">Complete Withdrawal</span>
      </ReactTooltip>
      <style jsx>{`
        .historyIcon__btn {
          cursor: pointer;
          line-height: 0;
          border-radius: 50%;
          width: 1.75rem;
          height: 1.75rem;
          background: ${MAIN};
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0px 1px 12px rgba(0, 230, 204, 0.25);
        }
        .historyIcon__btn:hover {
          background: ${MAIN_DARK};
        }
        .historyIcon__iconImg {
          width: 1.25rem;
          position: relative;
          top: 1px;
        }
      `}</style>
    </>
  ) : (
    iconEl
  )
}

const mapDispatchToProps = () => ({
  completeWithdrawal
})

export default connect(undefined, mapDispatchToProps)(TransactionHistoryIcon)
