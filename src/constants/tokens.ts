import config from '../config'

export type Token = {
  name: string
  unit: string
  tokenContractAddress: string
  depositContractAddress: string
  imgSrc: string
  imgAspect: number
  hidden: boolean
  balance?: number
}

const TOKEN_LIST: Token[] = [
  {
    name: 'Ethereum',
    unit: 'ETH',
    tokenContractAddress: config.PlasmaETH,
    depositContractAddress: config.payoutContracts.DepositContract,
    imgSrc: '../tokenIcons/ethereum-logo.png',
    imgAspect: 0.614,
    hidden: false
  },
  {
    name: 'Dai Stablecoin',
    unit: 'DAI',
    // FIXME: change token addresses
    tokenContractAddress: config.PlasmaETH,
    depositContractAddress: config.payoutContracts.DepositContract,
    imgSrc: '../tokenIcons/dai-logo.png',
    imgAspect: 1,
    hidden: process.env.ETH_NETWORK !== 'local'
  }
].filter(token => {
  return !token.hidden
})

export default TOKEN_LIST

export function getTokenByTokenContractAddress(
  address: string
): Token | undefined {
  return TOKEN_LIST.find(
    ({ tokenContractAddress }) =>
      tokenContractAddress.toLowerCase() === address.toLowerCase()
  )
}

export function getTokenByUnit(targetUnit: string): Token | undefined {
  return TOKEN_LIST.find(({ unit }) => unit === targetUnit)
}
