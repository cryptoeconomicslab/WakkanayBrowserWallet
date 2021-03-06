import { ethers } from 'ethers'
import Web3 from 'web3'
import { Web3Wallet } from './Web3Wallet'
import { validateNetwork } from './WalletUtils'

/**
 * MetamaskWallet is wallet implementation for Metamask
 */
export class MetamaskService {
  static async initialize(networkName: string): Promise<Web3Wallet> {
    if (typeof window.ethereum === undefined) {
      throw new Error('cannot find ethereum object.')
    }
    // to support privacy mode of MetaMask
    await window.ethereum.enable()
    window.web3 = new Web3(window.ethereum)
    const provider = new ethers.providers.Web3Provider(
      window.web3.currentProvider
    )
    const address = await provider.getSigner().getAddress()
    // wait the network is ready
    const network = await provider.getNetwork()
    validateNetwork(networkName, network.name)
    return new Web3Wallet(address, provider)
  }
}
