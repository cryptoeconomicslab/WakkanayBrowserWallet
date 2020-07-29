const dotenv = require('dotenv')
dotenv.config()

module.exports = {
  env: {
    ETH_NETWORK: process.env.ETH_NETWORK,
    MAIN_CHAIN_URL: process.env.MAIN_CHAIN_URL,
    AGGREGATOR_URL: process.env.AGGREGATOR_URL,
    BLOCK_EXPLORER_URL: process.env.BLOCK_EXPLORER_URL,
    SENTRY_ENDPOINT: process.env.SENTRY_ENDPOINT,
    MAGIC_LOGIN_PUBLISHABLE_KEY: process.env.MAGIC_LOGIN_PUBLISHABLE_KEY
  },
  webpack: config => {
    config.node = {
      module: 'empty',
      fs: 'empty',
      child_process: 'empty',
      net: 'empty',
      dns: 'empty',
      tls: 'empty'
    }
    config.optimization.minimize = false
    config.optimization.minimizer = []
    return config
  }
}
