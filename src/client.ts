import LightClient from '@cryptoeconomicslab/plasma-light-client'
import initialize from './initialize'
import { Web3Wallet, WALLET_KIND } from './wallet'

class ClientWrapper {
  private instance: LightClient
  private _wallet: Web3Wallet

  /**
   * Returns client singleton. Lazily initialized on client side.
   * Returns null on server side.
   * @returns {?Client}
   */
  getClient(): LightClient | null {
    if (this.instance) return this.instance

    return null
  }

  /**
   * initialize plasma light client with privateKey
   * @param {*} walletParams is object which to create wallet
   *   walletParams must have "kind" property. It is a way of creating wallet.
   */
  async initializeClient(walletParams: { kind: WALLET_KIND; email?: string }) {
    if (this.instance) return

    if (process.browser) {
      const { client, wallet } = await initialize(walletParams)
      this.instance = client
      this._wallet = wallet
    }
  }

  async start() {
    if (!this.instance) return
    await this.instance.start()
  }

  get wallet(): Web3Wallet | null {
    if (this._wallet) return this._wallet
    return null
  }
}

const clientWrapper = new ClientWrapper()
export default clientWrapper
