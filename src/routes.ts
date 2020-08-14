import Router from 'next/router'

export const ROOT = '/'

export const WALLET = '/wallet'
export const HISTORY = '/history'

export const PAYMENT = '/payment'
export const EXCHANGE = '/exchange'
export const NFT_COLLECTIBLES = '/nft_collectibles'

/**
 * @name openModal
 * @param { modal: string, token: string } args
 * @param args.modal The name of the modal "deposit" or "withdraw"
 * @param args.token The token address of the selected modal
 */
export function openModal(args) {
  Router.push(
    {
      pathname: Router.pathname,
      query: args
    },
    undefined,
    { shallow: true }
  )
}
