import { Address, Bytes } from '@cryptoeconomicslab/primitives'

/**
 * MetamaskSnapWallet is wallet implementation for Metamask Snaps Beta
 *     https://github.com/MetaMask/metamask-snaps-beta
 */
export class MetamaskSnapWallet {
  getAddress() {
    return Address.default()
  }
  getL1Balance() {
    throw new Error('not implemented')
  }
  async signMessage(message) {
    try {
      // identify the Snap by the location of its package.json file
      const snapId = new URL('package.json', window.location.href).toString()

      // call Plapp Snap (Metamask Plugin)'s "signL2Message" method
      const response = await window.ethereum.send({
        method: 'wallet_invokePlugin',
        params: [
          snapId,
          {
            method: 'signL2Message',
            params: [message.data]
          }
        ]
      })
      return Bytes.fromHexString(response)
    } catch (err) {
      console.error(err)
      alert('Problem happened: ' + err.message || err)
    }
  }
}
