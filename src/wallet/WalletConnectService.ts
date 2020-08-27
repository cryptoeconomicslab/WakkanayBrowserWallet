/* eslint-disable @typescript-eslint/no-var-requires */
import { ethers } from 'ethers'
import WalletConnectQRCodeModal from '@walletconnect/qrcode-modal'
import Web3 from 'web3'
import { Web3Wallet } from './Web3Wallet'
import { validateNetwork } from './WalletUtils'

let WalletConnectProvider
if (global.window) {
  WalletConnectProvider = require('@walletconnect/web3-provider').default
}

/**
 * WalletConnect is wallet implementation for Wallet Connect
 */
export class WalletConnectService {
  /**
   * initilize WalletConnect service
   */
  static async initilize(networkName: string): Promise<Web3Wallet> {
    const walletConnectProvider = new WalletConnectProvider({
      infuraId: 'b4c8518704574fe3992f9a479de0c004'
    })

    let connecting = false
    walletConnectProvider.wc.on('disconnect', (error, payload) => {
      if (connecting) {
        console.warn('disconnect', error, payload)
        WalletConnectQRCodeModal.close()
      }
    })
    try {
      connecting = true
      await walletConnectProvider.enable()
      connecting = false
    } catch (e) {
      connecting = false
      await walletConnectProvider.close()
    }
    // TODO: test operation on browser
    const web3 = new Web3(walletConnectProvider as any)
    const provider = new ethers.providers.Web3Provider(
      web3.currentProvider as any
    )
    const address = await provider.getSigner().getAddress()
    const network = await provider.getNetwork()
    validateNetwork(networkName, network.name)
    return new Web3Wallet(address, provider)
  }
}
