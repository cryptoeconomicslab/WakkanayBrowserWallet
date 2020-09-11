import React from 'react'
import { ActionType } from '@cryptoeconomicslab/plasma-light-client'
import { TransactionHistory } from '../store/transactionHistory'
import { shortenAddress } from '../utils'

type Props = {
  history: TransactionHistory
}

const TransactionHistoryMessage = ({ history }: Props): JSX.Element => {
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

export default TransactionHistoryMessage
