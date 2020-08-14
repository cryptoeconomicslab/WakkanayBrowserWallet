import { Contract } from 'ethers'
import { BigNumber } from 'ethers/utils'

export default class PETHContract {
  static abi = [
    'function wrap(uint256 _amount) payable',
    'function unwrap(uint256 _amount)'
  ]

  connection

  /**
   * constructor
   * @param {*} address hex string of contract address
   * @param {*} signer signer object of ethers.js
   */
  constructor(address, signer) {
    this.connection = new Contract(address, PETHContract.abi, signer)
  }

  /**
   * wrapping PETH
   * @name wrap
   * @param amount amount of wei.
   */
  async wrap(amount) {
    const bigNumberifiedAmount = new BigNumber(amount.toString())
    await this.connection.wrap(bigNumberifiedAmount, {
      value: bigNumberifiedAmount
    })
  }

  /**
   * unwrapping PETH
   * @name unwrap
   * @param amount amount of wei.
   */
  async unwrap(amount) {
    const bigNumberifiedAmount = new BigNumber(amount.toString())
    await this.connection.unwrap(bigNumberifiedAmount)
  }
}
