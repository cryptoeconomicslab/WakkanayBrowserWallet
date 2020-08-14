import configLocal from '../config.local'
import configKovan from '../config.kovan'

const configs = {
  local: configLocal,
  kovan: configKovan
}

const ethNetwork = process.env.ETH_NETWORK || 'local'
export const config = configs[ethNetwork]
