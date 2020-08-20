import { WALLET_KIND } from '../wallet/kind'
import { logoutMagicLink } from '../wallet/MagicLinkService'

export async function logout(localStorage) {
  const loggedInWith = localStorage.getItem('loggedInWith')
  if (loggedInWith === WALLET_KIND.WALLET_MAGIC_LINK) {
    const networkName = process.env.ETH_NETWORK
    await logoutMagicLink(networkName)
  }
  localStorage.removeItem('loggedInWith')
}
