import initialize from './initialize'

class ClientWrapper {
  constructor() {
    this.instance = null
  }

  /**
   * Returns client singleton. Lazily initialized on client side.
   * Returns null on server side.
   * @returns {?Client}
   */
  getClient() {
    if (this.instance) return this.instance

    return null
  }

  /**
   * initialize plasma light client with privateKey
   * @param {*} walletParams is object which to create wallet
   *   walletParams must have "kind" property. It is a way of creating wallet.
   */
  async initializeClient(walletParams) {
    if (this.instance) return

    if (process.browser) {
      const client = await initialize(walletParams)
      this.instance = client
    }
  }

  start() {
    if (!this.instance) return
    this.instance.start()
  }
}

const clientWrapper = new ClientWrapper()
export default clientWrapper
