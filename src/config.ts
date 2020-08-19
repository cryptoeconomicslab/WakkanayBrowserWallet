import configLocal from '../config.local.json'
import configKovan from '../config.kovan.json'

const configs = {
  local: configLocal,
  kovan: configKovan
}

const ethNetwork = process.env.ETH_NETWORK || 'local'
export default configs[ethNetwork]
