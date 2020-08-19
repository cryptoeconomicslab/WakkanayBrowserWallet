import { ethers } from 'ethers'
import { Address, BigNumber, Bytes } from '@cryptoeconomicslab/primitives'
import { Balance, Wallet } from '@cryptoeconomicslab/wallet'
import { createTypedParams } from '@cryptoeconomicslab/ovm'
import config from '../config'

const ERC20abi = [
  'function balanceOf(address tokenOwner) view returns (uint)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint)'
]

/**
 * Web3Wallet is wallet implementation for Web3Provider
 */
export class Web3Wallet implements Wallet {
  private address: string
  public provider: ethers.providers.Web3Provider

  /**
   * Web3Wallet
   * @param {*} address address string
   * @param {*} provider Web3Provider
   */
  constructor(address: string, provider: ethers.providers.Web3Provider) {
    this.address = address
    this.provider = provider
  }

  public getAddress(): Address {
    return Address.from(this.address)
  }

  public async getL1Balance(tokenAddress?: Address): Promise<Balance> {
    let value: BigNumber, decimals: number, symbol: string
    if (tokenAddress) {
      const contract = new ethers.Contract(
        tokenAddress.data,
        ERC20abi,
        this.provider
      )
      const ERC20 = contract.connect(this.provider)
      const balance = await ERC20.balanceOf(this.address)
      value = BigNumber.fromString(balance.toString())
      decimals = Number(await ERC20.decimals())
      symbol = await ERC20.symbol()
    } else {
      const balance = await this.provider.getBalance(this.address)
      value = BigNumber.fromString(balance.toString())
      decimals = 18
      symbol = 'ETH'
    }
    return new Balance(value, decimals, symbol)
  }

  public async signMessage(message: Bytes): Promise<Bytes> {
    const signature = await this.provider.send('eth_signTypedData', [
      createTypedParams(config, message),
      this.address
    ])
    return Bytes.fromHexString(signature)
  }

  public async verifyMySignature(
    message: Bytes,
    signature: Bytes
  ): Promise<boolean> {
    throw Error('not implemented yet')
  }
}
