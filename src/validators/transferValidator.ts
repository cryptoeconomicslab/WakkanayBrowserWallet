import JSBI from 'jsbi'
import LightClient from '@cryptoeconomicslab/plasma-light-client'
import { isAddress } from '../utils'

export default async function validateTransfer(
  client: LightClient,
  amountWei: JSBI,
  tokenContractAddress: string,
  recipientAddress: string
): Promise<string[]> {
  const errors: string[] = []
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
