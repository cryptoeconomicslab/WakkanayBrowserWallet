import JSBI from 'jsbi'
import { isAddress } from '../utils'

export default async function validateTransfer(
  client,
  amountWei,
  tokenContractAddress,
  recipientAddress
) {
  const errors = []
  const balanceList = await client.getBalance()
  const balance = balanceList.find(
    balance =>
      balance.tokenContractAddress.toLowerCase() ===
      tokenContractAddress.toLowerCase()
  )
  if (JSBI.greaterThan(amountWei, balance.amount)) {
    errors.push('Insufficient funds.')
  }
  if (!isAddress(recipientAddress)) {
    errors.push('Invalid address.')
  }
  return errors
}
