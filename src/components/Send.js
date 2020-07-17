import React from 'react'
import { connect } from 'react-redux'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
library.add(faSignOutAlt)
import {
  isAbleToSubmit,
  setTransferredToken,
  setTransferredAmount,
  setRecepientAddress,
  transfer
} from '../store/transfer'
import { MAIN, SECTION_BACKGROUND } from '../constants/colors'
import { getTokenByTokenContractAddress, TOKEN_LIST } from '../constants/tokens'
import { TokenSelector } from './TokenSelector'
import AddressInput from './AddressInput'
import Button from './Base/Button'
import Message from './Base/Message'
import { SectionTitle } from './SectionTitle'
import TokenInput from './TokenInput'

const Send = props => {
  const transferredTokenObj = getTokenByTokenContractAddress(
    props.transferredToken
  )
  const tokensWithCurrentAmount = TOKEN_LIST.map(token => ({
    ...token,
    amount: props.tokenBalance[token.unit]
      ? props.tokenBalance[token.unit].amount /
        10 ** props.tokenBalance[token.unit].decimals
      : 0
  }))

  return (
    <div className="send-section" id="send">
      <SectionTitle>Send Token</SectionTitle>
      <TokenSelector
        items={tokensWithCurrentAmount}
        onSelected={props.setTransferredToken}
        selectedToken={transferredTokenObj}
      />
      <TokenInput
        className="mts mbs"
        value={props.transferredAmount}
        unit={transferredTokenObj.unit}
        handleAmount={props.setTransferredAmount}
      />
      <AddressInput
        className="mbs"
        type="text"
        handleAddress={props.setRecepientAddress}
      />
      <Button
        full
        onClick={() => {
          props.transfer(
            props.transferredAmount,
            props.transferredToken,
            props.recepientAddress
          )
        }}
        disabled={props.isAbleToSubmit}
      >
        Send
      </Button>
      {props.transferPage === 'completion-page' && (
        <Message color={MAIN}>Transfer Success!</Message>
      )}

      <style jsx>{`
        .send-section {
          display: flex;
          flex-direction: column;
          margin: 0.25rem 0;
          background-color: ${SECTION_BACKGROUND};
          position: relative;
        }
      `}</style>
    </div>
  )
}

const mapStateToProps = state => ({
  address: state.address,
  tokenBalance: state.tokenBalance.tokenBalance,
  ETHtoUSD: state.tokenBalance.ETHtoUSD,
  isAbleToSubmit: isAbleToSubmit(state),
  transferredToken: state.transferState.transferredToken,
  transferredAmount: state.transferState.transferredAmount,
  recepientAddress: state.transferState.recepientAddress,
  transferPage: state.transferState.transferPage
})

const mapDispatchToProps = {
  setTransferredToken,
  setTransferredAmount,
  setRecepientAddress,
  transfer
}
export default connect(mapStateToProps, mapDispatchToProps)(Send)
