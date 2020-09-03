import { formatEther, parseEther } from 'ethers/utils'
import JSBI from 'jsbi'
import { UserAction, ActionType } from '@cryptoeconomicslab/plasma-light-client'
import { getTokenByTokenContractAddress } from '../constants/tokens'
import { TransactionHistory } from '../store/transactionHistory'

function isMergeable(userAction: UserAction): boolean {
  return (
    userAction.type === ActionType.Send ||
    userAction.type === ActionType.Receive
  )
}

function transformTransactionHistoryFrom(
  userAction: UserAction
): TransactionHistory | undefined {
  const token = getTokenByTokenContractAddress(userAction.tokenAddress)
  if (!token) return undefined
  return {
    chunkId: userAction.chunkId,
    message: userAction.type,
    amount: formatEther(userAction.amount.toString()),
    unit: token.unit,
    blockNumber: userAction.blockNumber.toString(),
    counterParty: userAction.counterParty,
    depositContractAddress: token.depositContractAddress,
    ranges: userAction.ranges
  }
}

export function mergeTransactionHistoryByChunkId(
  userActions: UserAction[]
): TransactionHistory[] {
  const depositExitHistories: TransactionHistory[] = []
  const mergedSendReceiveHistoryMap: {
    [chunkId: string]: TransactionHistory
  } = userActions.reduce(
    (
      map: { [chunkId: string]: TransactionHistory },
      userAction: UserAction
    ) => {
      if (isMergeable(userAction)) {
        if (map[userAction.chunkId]) {
          map[userAction.chunkId].amount = formatEther(
            JSBI.add(
              JSBI.BigInt(parseEther(map[userAction.chunkId].amount)),
              userAction.amount
            ).toString()
          )
        } else {
          const transactionHistory = transformTransactionHistoryFrom(userAction)
          if (transactionHistory) map[userAction.chunkId] = transactionHistory
        }
      } else {
        const transactionHistory = transformTransactionHistoryFrom(userAction)
        if (transactionHistory) depositExitHistories.push(transactionHistory)
      }
      return map
    },
    {}
  )

  const sendReceiveHistories: TransactionHistory[] = []
  Object.keys(mergedSendReceiveHistoryMap).forEach((chunkId: string) => {
    sendReceiveHistories.push(mergedSendReceiveHistoryMap[chunkId])
  })

  const histories = depositExitHistories
    .concat(sendReceiveHistories)
    .sort((a, b) => (a.blockNumber > b.blockNumber ? 1 : -1))
  return histories
}
