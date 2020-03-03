export const shortenAddress = address => {
  if (!address) return ''
  const former = address.slice(0, 7)
  const latter = address.slice(address.length - 5, address.length)
  return `${former}...${latter}`
}
export const TOKEN_CURRENCY_MAP = {
  Ethereum: 'ETH',
  Dai: 'DAI'
}

export const roundBalance = (rate, tokenAmount) => {
  return Math.round(rate * tokenAmount * 100) / 100
}
