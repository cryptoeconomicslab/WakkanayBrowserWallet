import { Web3Wallet } from './Web3Wallet'
import { ethers } from 'ethers'
import { Magic } from 'magic-sdk'

function getNetworkObject(network) {
  const rpcUrl = process.env.MAIN_CHAIN_HOST || 'http://localhost:8545'
  return network === 'local'
    ? {
        rpcUrl
      }
    : network
}

/**
 * MagicLinkWallet is wallet implementation for MagicLink
 */
export class MagicLinkService {
  static async initialize(email, network) {
    if (!process.browser) return
    const publishableKey = process.env.MAGIC_LOGIN_PUBLISHABLE_KEY
    const magic = new Magic(publishableKey, {
      network: getNetworkObject(network)
    })
    const isLoggedIn = await magic.user.isLoggedIn()
    if (isLoggedIn) {
      const provider = new ethers.providers.Web3Provider(magic.rpcProvider)
      const address = await provider.getSigner().getAddress()
      await provider.ready
      return new Web3Wallet(address, provider)
    } else {
      await magic.auth.loginWithMagicLink({ email })
    }
  }
}
