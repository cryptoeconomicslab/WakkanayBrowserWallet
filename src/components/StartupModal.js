import { useState } from 'react'
import {
  initializeClient,
  initializeMetamaskWallet,
  initializeMagicLinkWallet,
  initializeWalletConnect
} from '../store/appStatus'
import { connect } from 'react-redux'
import { FZ_MEDIUM } from '../constants/fonts'
import Input from './Base/Input'
import Button from './Base/Button'
import { BORDER, White, PLACEHOLDER } from '../constants/colors'

const StartUpModal = props => {
  const [email, setEmail] = useState('')

  const updateEmail = e => {
    setEmail(e.target.value.trim())
  }

  return (
    <div className="container">
      <img src="/logo-gray.svg" width="82" />
      <p className="sub mtm mbs">
        Create L2 wallet from your mainchain wallet to start gazelle!
      </p>
      <div>
        <Input
          className="mbs"
          full
          placeholder={'example@gzle.io'}
          type="email"
          onChange={updateEmail}
        />
        <Button
          full
          disabled={!email}
          onClick={() => props.initializeMagicLinkWallet(email)}
        >
          Create Wallet
        </Button>
        <div className="spacer">
          <div className="spacer__txt">or</div>
        </div>
        <Button full onClick={props.initializeMetamaskWallet}>
          Connect to MetaMask
        </Button>
        {process.env.ETH_NETWORK === 'main' && (
          <Button full onClick={props.initializeWalletConnect}>
            Connect to WalletConnect compatible wallet
          </Button>
        )}
      </div>
      <style jsx>{`
        .container {
          text-align: center;
          font-size: ${FZ_MEDIUM};
        }
        .private-key-input {
          width: 100%;
        }
        .spacer {
          border-top: 1px solid ${BORDER};
          width: 5rem;
          margin: 1.125rem auto 0;
        }
        .spacer__txt {
          color: ${PLACEHOLDER};
          width: 3rem;
          display: block;
          background: ${White()};
          position: relative;
          top: -0.625rem;
          left: 1rem;
        }
      `}</style>
    </div>
  )
}

const mapDispatchToProps = {
  initializeClient,
  initializeMetamaskWallet,
  initializeMagicLinkWallet,
  initializeWalletConnect
}
export default connect(undefined, mapDispatchToProps)(StartUpModal)
