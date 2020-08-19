import { ethers } from 'ethers'
import { Magic, EthNetworkName } from 'magic-sdk'
import { Web3Wallet } from './Web3Wallet'

function getNetworkObject(
  network: string
): EthNetworkName | { rpcUrl: string } {
  const rpcUrl = process.env.MAIN_CHAIN_URL || 'http://localhost:8545'
  return network === 'local'
    ? {
        rpcUrl
      }
    : (network as EthNetworkName)
}

/**
 * MagicLinkWallet is wallet implementation for MagicLink
 */
export class MagicLinkService {
  static async initialize(
    email: string,
    network: string
  ): Promise<Web3Wallet | undefined> {
    if (!process.browser) return
    const publishableKey = process.env.MAGIC_LOGIN_PUBLISHABLE_KEY
    const magic = new Magic(publishableKey, {
      network: getNetworkObject(network)
    })
    const isLoggedIn = await magic.user.isLoggedIn()
    if (isLoggedIn) {
      const provider = new ethers.providers.Web3Provider(magic.rpcProvider)
      const address = await provider.getSigner().getAddress()
      await provider.getNetwork()
      return new Web3Wallet(address, provider)
    } else {
      await magic.auth.loginWithMagicLink({ email })
    }
  }
}
