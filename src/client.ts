import LightClient from '@cryptoeconomicslab/plasma-light-client'
import initialize from './initialize'
import { Web3Wallet, WALLET_KIND } from './wallet'

class ClientWrapper {
  private _instance?: LightClient
  private _wallet?: Web3Wallet

  /**
   * initialize plasma light client with privateKey
   * @param {*} walletParams is object which to create wallet
   *   walletParams must have "kind" property. It is a way of creating wallet.
   */
  async initializeClient(walletParams: { kind: WALLET_KIND; email?: string }) {
    if (this._instance) return

    if (process.browser) {
      const { client, wallet } = await initialize(walletParams)
      this._instance = client
      this._wallet = wallet
    }
  }

  /**
   * Start plasma light client
   */
  async start() {
    if (!this._instance) return
    await this._instance.start()
  }

  /**
   * Returns client singleton. Lazily initialized on client side.
   * Returns undefined on server side.
   * @returns {?Client}
   */
  get client(): LightClient | undefined {
    return this._instance
  }

  /**
   * Returns Web3Wallet.
   */
  get wallet(): Web3Wallet | undefined {
    return this._wallet
  }
}

const clientWrapper = new ClientWrapper()
export default clientWrapper
