import { ActionType } from '@cryptoeconomicslab/plasma-light-client'
import { shortenAddress } from '../utils'

export default ({ history }) => {
  if (history.message === ActionType.Send) {
    return (
      <>{`${history.message} to ${shortenAddress(history.counterParty)}`}</>
    )
  } else if (history.message === ActionType.Receive) {
    return (
      <>{`${history.message} from ${shortenAddress(history.counterParty)}`}</>
    )
  } else {
    return <>{history.message}</>
  }
}
