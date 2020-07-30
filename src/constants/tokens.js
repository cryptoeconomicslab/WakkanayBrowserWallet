import { config } from '../config'

export const TOKEN_LIST = [
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

export function getTokenByTokenContractAddress(address) {
  return TOKEN_LIST.find(
    ({ tokenContractAddress }) =>
      tokenContractAddress.toLowerCase() === address.toLowerCase()
  )
}

export function getTokenByUnit(targetUnit) {
  return TOKEN_LIST.find(({ unit }) => unit === targetUnit)
}
