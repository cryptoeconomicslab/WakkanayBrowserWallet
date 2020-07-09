import * as ethers from 'ethers'
import LightClient from '@cryptoeconomicslab/plasma-light-client'
import {
  MetamaskService,
  MetamaskSnapWallet,
  MagicLinkService,
  WalletConnectService
} from './wallet'
import { EthWallet } from '@cryptoeconomicslab/eth-wallet'
import { Address, Bytes } from '@cryptoeconomicslab/primitives'
import { IndexedDbKeyValueStore } from '@cryptoeconomicslab/indexeddb-kvs'
import {
  DepositContract,
  ERC20Contract,
  CommitmentContract,
  AdjudicationContract,
  OwnershipPayoutContract,
  PETHContract
} from '@cryptoeconomicslab/eth-contract'
import { WALLET_KIND } from './wallet'
import * as Sentry from '@sentry/browser'
if (process.env.SENTRY_ENDPOINT) {
  Sentry.init({
    dsn: process.env.SENTRY_ENDPOINT
  })
}

function getProvider(network) {
  if (network === 'local') {
    return new ethers.providers.JsonRpcProvider(process.env.MAIN_CHAIN_HOST)
  } else if (network === 'kovan') {
    return new ethers.getDefaultProvider('kovan')
  }
}

async function instantiate(walletParams) {
  const networkName = process.env.ETH_NETWORK
  const kind = walletParams.kind

  let wallet, signer
  if (kind === WALLET_KIND.WALLET_PRIVATEKEY) {
    wallet = new EthWallet(
      new ethers.Wallet(walletParams.privateKey, getProvider(networkName))
    )
    signer = wallet.getEthersWallet()
  } else if (kind === WALLET_KIND.WALLET_METAMASK) {
    wallet = await MetamaskService.initialize(networkName)
    signer = wallet.provider.getSigner()
  } else if (kind === WALLET_KIND.WALLET_MAGIC_LINK) {
    wallet = await MagicLinkService.initialize(walletParams.email)
    if (!wallet) {
      location.reload()
      return
    }
    signer = wallet.provider.getSigner()
  } else if (kind === WALLET_KIND.WALLET_CONNECT) {
    wallet = await WalletConnectService.initilize()
    signer = wallet.provider.getSigner()
  } else if (kind === WALLET_KIND.WALLET_METAMASK_SNAP) {
    await window.ethereum.enable()
    wallet = new MetamaskSnapWallet()
    signer = new ethers.providers.Web3Provider(window.ethereum).getSigner()
    wallet.getEthersWallet = () =>
      new ethers.providers.Web3Provider(window.ethereum).getSigner()
  } else {
    throw new Error(`gazelle-wallet doesn't support ${kind}`)
  }

  const mainChainEnv = process.env.MAIN_CHAIN_ENV || 'local'
  const config = await import(`../config.${mainChainEnv}`)
  const address = wallet.getAddress()
  const kvs = new IndexedDbKeyValueStore(
    Bytes.fromString('wallet_' + address.data)
  )
  const eventDb = await kvs.bucket(Bytes.fromString('event'))
  const adjudicationContract = new AdjudicationContract(
    Address.from(config.adjudicationContract),
    eventDb,
    signer
  )

  const ownershipPayoutContract = new OwnershipPayoutContract(
    Address.from(config.payoutContracts.OwnershipPayout),
    signer
  )

  function depositContractFactory(address) {
    return new DepositContract(address, eventDb, signer)
  }

  function tokenContractFactory(address) {
    return new ERC20Contract(address, signer)
  }

  const commitmentContract = new CommitmentContract(
    Address.from(config.commitmentContract),
    eventDb,
    signer
  )

  const client = await LightClient.initilize({
    wallet,
    witnessDb: kvs,
    adjudicationContract,
    depositContractFactory,
    tokenContractFactory,
    commitmentContract,
    ownershipPayoutContract,
    deciderConfig: config,
    aggregatorEndpoint: process.env.AGGREGATOR_HOST
  })

  // register Peth
  await client.registerCustomToken(
    new PETHContract(Address.from(config.PlasmaETH), signer),
    depositContractFactory(Address.from(config.payoutContracts.DepositContract))
  )

  return client
}

export default async function initialize(walletParams) {
  const lightClient = await instantiate(walletParams)
  await lightClient.start()

  // TODO: need more secure way to store private key.
  if (
    walletParams.kind === WALLET_KIND.WALLET_PRIVATEKEY &&
    typeof walletParams.privateKey === 'string'
  ) {
    localStorage.setItem('privateKey', walletParams.privateKey)
  }

  return lightClient
}
