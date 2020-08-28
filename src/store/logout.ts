import { createAction } from '@reduxjs/toolkit'
import { WALLET_KIND } from '../wallet/kind'
import { logoutMagicLink } from '../wallet/MagicLinkService'

export enum USER_LOGOUT_ACTION_TYPES {
  USER_LOGOUT = 'USER_LOGOUT'
}

export const userLogout = createAction(USER_LOGOUT_ACTION_TYPES.USER_LOGOUT)

export const logout = () => {
  return async dispatch => {
    const loggedInWith = localStorage.getItem('loggedInWith')
    if (loggedInWith === WALLET_KIND.WALLET_MAGIC_LINK) {
      const networkName = process.env.ETH_NETWORK || ''
      await logoutMagicLink(networkName)
    }
    localStorage.removeItem('loggedInWith')
    dispatch(userLogout())
  }
}
