import LightClient from '@cryptoeconomicslab/plasma-light-client'
import initialize from './initialize'
import { Web3Wallet, WALLET_KIND } from './wallet'

class ClientWrapper {
  private instance: LightClient | null
  private _wallet: Web3Wallet | null

  constructor() {
    this.instance = null
    this._wallet = null
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

  /**
   * Start plasma light client
   */
  async start() {
    if (!this.instance) return
    await this.instance.start()
  }

  /**
   * Returns client singleton. Lazily initialized on client side.
   * Returns null on server side.
   * @returns {?Client}
   */
  get client(): LightClient | null {
    return this.instance
  }

  /**
   * Returns Web3Wallet.
   */
  get wallet(): Web3Wallet | null {
    return this._wallet
  }
}

const clientWrapper = new ClientWrapper()
export default clientWrapper
