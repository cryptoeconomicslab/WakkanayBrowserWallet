import * as ethers from 'ethers'
import LightClient from '@cryptoeconomicslab/plasma-light-client'
import { Address, Bytes } from '@cryptoeconomicslab/primitives'
import { IndexedDbKeyValueStore } from '@cryptoeconomicslab/indexeddb-kvs'
import {
  AdjudicationContract,
  CommitmentContract,
  CheckpointDisputeContract,
  DepositContract,
  ERC20Contract,
  ExitDisputeContract,
  OwnershipPayoutContract
} from '@cryptoeconomicslab/eth-contract'
import * as Sentry from '@sentry/browser'
import { CaptureConsole } from '@sentry/integrations'
import config from './config'
import EthNetworkName from './types/EthNetworkName'
import {
  MetamaskService,
  MagicLinkService,
  WalletConnectService,
  Web3Wallet,
  WalletParams,
  WALLET_KIND
} from './wallet'
import { sleep } from './utils'

if (process.env.SENTRY_ENDPOINT) {
  Sentry.init({
    dsn: process.env.SENTRY_ENDPOINT,
    integrations: [
      new CaptureConsole({
        levels: ['error']
      })
    ]
  })
}

function getProvider(network: EthNetworkName): ethers.providers.BaseProvider {
  if (network === 'local') {
    return new ethers.providers.JsonRpcProvider(process.env.MAIN_CHAIN_URL)
  } else {
    return ethers.getDefaultProvider(network)
  }
}

async function registerPeth(client: LightClient) {
  try {
    // FIXME: temporary measures
    await sleep(1000)
    await client.registerToken(
      config.PlasmaETH,
      config.payoutContracts.DepositContract
    )
  } catch (e) {
    console.error(e)
    console.log('retry register PETH')
    await registerPeth(client)
  }
}

async function instantiate(
  walletParams: WalletParams
): Promise<{
  client: LightClient | undefined
  wallet: Web3Wallet | undefined
}> {
  const networkName = process.env.ETH_NETWORK as EthNetworkName
  const kind = walletParams.kind

  let wallet: Web3Wallet | undefined
  if (kind === WALLET_KIND.WALLET_METAMASK) {
    wallet = await MetamaskService.initialize(networkName)
  } else if (kind === WALLET_KIND.WALLET_MAGIC_LINK) {
    wallet = await MagicLinkService.initialize(networkName, walletParams.email)
  } else if (kind === WALLET_KIND.WALLET_CONNECT) {
    wallet = await WalletConnectService.initilize(networkName)
  } else {
    throw new Error(`gazelle-wallet doesn't support ${kind}.`)
  }

  // for magic link
  if (!wallet) {
    location.reload()
    return { client: undefined, wallet: undefined }
  }

  const address = wallet.getAddress()
  const signer = wallet.provider.getSigner()
  const kvs = new IndexedDbKeyValueStore(
    Bytes.fromString('wallet_' + address.data)
  )
  const eventDb = await kvs.bucket(Bytes.fromString('event'))
  const provider = getProvider(networkName)
  const eventWatcherOptions = {
    interval: 12000
  }
  const disputeContractEventWatcherOptions = {
    interval: 20000
  }
  const adjudicationContract = new AdjudicationContract(
    Address.from(config.adjudicationContract),
    eventDb,
    signer,
    provider,
    eventWatcherOptions
  )

  const ownershipPayoutContract = new OwnershipPayoutContract(
    Address.from(config.payoutContracts.OwnershipPayout),
    signer
  )

  function depositContractFactory(address: Address) {
    return new DepositContract(
      address,
      eventDb,
      signer,
      provider,
      eventWatcherOptions
    )
  }

  function tokenContractFactory(address: Address) {
    return new ERC20Contract(address, signer)
  }

  const commitmentContract = new CommitmentContract(
    Address.from(config.commitment),
    eventDb,
    signer,
    provider,
    eventWatcherOptions
  )

  const checkpointDisputeContract = new CheckpointDisputeContract(
    Address.from(config.checkpointDispute),
    eventDb,
    signer,
    provider,
    disputeContractEventWatcherOptions
  )

  const exitDisputeContract = new ExitDisputeContract(
    Address.from(config.exitDispute),
    eventDb,
    signer,
    provider,
    disputeContractEventWatcherOptions
  )

  const client = await LightClient.initilize({
    wallet,
    witnessDb: kvs,
    adjudicationContract,
    depositContractFactory,
    tokenContractFactory,
    commitmentContract,
    ownershipPayoutContract,
    checkpointDisputeContract,
    exitDisputeContract,
    deciderConfig: config,
    aggregatorEndpoint: process.env.AGGREGATOR_URL
  })

  await registerPeth(client)

  return { client, wallet }
}

export default async function initialize(
  walletParams: WalletParams
): Promise<{
  client: LightClient | undefined
  wallet: Web3Wallet | undefined
}> {
  const { client, wallet } = await instantiate(walletParams)
  localStorage.setItem('loggedInWith', walletParams.kind)
  return { client, wallet }
}
