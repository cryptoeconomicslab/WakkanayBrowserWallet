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
      await initialize(walletParams)
    }
  }

  /**
   * Start plasma light client
   */
  async start() {
    if (!this._instance) return
    await this._instance.start()
  }

  setClient(client: LightClient) {
    this._instance = client
  }

  setWallet(wallet: Web3Wallet) {
    this._wallet = wallet
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
