import { ActionType } from '@cryptoeconomicslab/plasma-light-client'
import Button from './Base/Button'
import { completeWithdrawal } from '../store/withdraw'
import { findExit } from '../helper/withdrawHelper'
import { shortenAddress } from '../utils'

export default ({ pendingExitList, history }) => {
  if (history.message === ActionType.Send) {
    return (
      <>{`${history.message} to ${shortenAddress(history.counterParty)}`}</>
    )
  } else if (history.message === ActionType.Receive) {
    return (
      <>{`${history.message} from ${shortenAddress(history.counterParty)}`}</>
    )
  } else if (history.message === ActionType.Exit) {
    const exit = findExit(
      pendingExitList,
      history.blockNumber,
      history.range,
      history.depositContractAddress
    )
    return (
      <>
        <div className="exitWrapper">
          {history.message}
          {exit && (
            <Button
              size="tiny"
              // TODO: change correct value after update framework
              // disable={exit.isDecidable}
              disable={false}
              onClick={completeWithdrawal(exit)}
            >
              Complete
            </Button>
          )}
          <style jsx>{`
            .exitWrapper {
              display: flex;
            }
            :global(.button) {
              margin-left: 4px;
            }
          `}</style>
        </div>
      </>
    )
  } else {
    return <>{history.message}</>
  }
}
