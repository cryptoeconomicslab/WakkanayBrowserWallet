import { formatEther } from 'ethers/utils'
import { UserAction } from '@cryptoeconomicslab/plasma-light-client'
import { getTokenByTokenContractAddress } from '../constants/tokens'
import { TransactionHistory } from '../store/transactionHistory'

export function transformTransactionHistoryFrom(
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
