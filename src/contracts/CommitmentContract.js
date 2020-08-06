import { Contract } from 'ethers'

export default class CommitmentContract {
  static abi = ['function currentBlock() view returns (uint256)']

  connection

  /**
   * constructor
   * @param {*} address hex string of contract address
   * @param {*} signer signer object of ethers.js
   */
  constructor(address, signer) {
    this.connection = new Contract(address, CommitmentContract.abi, signer)
  }

  /**
   * get current plasma block number
   */
  async getCurrentBlockNumber() {
    const blockNumber = await this.connection.currentBlock()
    return blockNumber.toString()
  }
}
