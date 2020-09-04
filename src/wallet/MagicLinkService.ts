import { ethers } from 'ethers'
import { Magic, EthNetworkName } from 'magic-sdk'
import { WALLET_KIND } from './kind'
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

function getMagicInstance(network: string): Magic {
  const publishableKey = process.env.MAGIC_LOGIN_PUBLISHABLE_KEY || ''
  return new Magic(publishableKey, {
    network: getNetworkObject(network)
  })
}

export async function logoutMagicLink(network: string): Promise<void> {
  const magic = getMagicInstance(network)
  const isLoggedIn = await magic.user.isLoggedIn()
  if (isLoggedIn) {
    await magic.user.logout()
  }
}

/**
 * MagicLinkWallet is wallet implementation for MagicLink
 */
export class MagicLinkService {
  static async initialize(
    network: string,
    email?: string
  ): Promise<Web3Wallet | undefined> {
    if (!process.browser) return

    const magic = getMagicInstance(network)
    const isLoggedIn = await magic.user.isLoggedIn()
    if (isLoggedIn) {
      const provider = new ethers.providers.Web3Provider(magic.rpcProvider)
      const address = await provider.getSigner().getAddress()
      await provider.getNetwork()
      return new Web3Wallet(address, provider)
    } else {
      if (!email) {
        throw new Error(
          `${WALLET_KIND.WALLET_MAGIC_LINK} needs email parameter.`
        )
      }
      await magic.auth.loginWithMagicLink({ email })
    }
  }
}
