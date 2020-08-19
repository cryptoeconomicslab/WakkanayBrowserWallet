export const shortenAddress = (address: string): string => {
  if (!address) return ''
  const former = address.slice(0, 6)
  const latter = address.slice(address.length - 4, address.length)
  return `${former}...${latter}`
}

export const isAddress = (address: string): boolean => {
  if (!address || !address.match(/^0x[0-9A-Fa-f]{40}$/)) {
    return false
  }
  return true
}

/**
 * round off the number
 * e.g. the second place after the decimal point: base = 100
 */
export const roundBalance = (value: number, base = 100): number => {
  return Math.round(value * base) / base
}

export const sleep = async (time = 1000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, time))
}
