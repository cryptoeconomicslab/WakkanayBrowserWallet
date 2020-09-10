import React from 'react'
import { connect } from 'react-redux'
import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
library.add(faSignOutAlt)
import { isAbleToTransfer } from '../selectors/transferSelector'
import { AppState } from '../store'
import {
  setTransferredToken,
  setTransferredAmount,
  setRecepientAddress,
  transfer
} from '../store/transfer'
import { SECTION_BACKGROUND } from '../constants/colors'
import TOKEN_LIST, {
  getTokenByTokenContractAddress,
  Token
} from '../constants/tokens'
import { BalanceList } from '../types/Balance'
import TokenSelector from './TokenSelector'
import AddressInput from './AddressInput'
import Button from './Base/Button'
import SectionTitle from './SectionTitle'
import TokenInput from './TokenInput'

interface Props {
  l2Balance: BalanceList
  isAbleToTransfer: boolean
  transferredToken: string
  transferredAmount: string
  recepientAddress: string
  setTransferredToken: ActionCreatorWithPayload<string, string>
  setTransferredAmount: ActionCreatorWithPayload<string, string>
  setRecepientAddress: ActionCreatorWithPayload<string, string>
  transfer: (
    amount: string,
    tokenContractAddress: string,
    recipientAddress: string
  ) => Promise<void>
}

const Send = ({
  l2Balance,
  isAbleToTransfer,
  transferredToken,
  transferredAmount,
  recepientAddress,
  setTransferredToken,
  setTransferredAmount,
  setRecepientAddress,
  transfer
}: Props) => {
  const transferredTokenObj: Token =
    getTokenByTokenContractAddress(transferredToken) === undefined
      ? TOKEN_LIST[0]
      : (getTokenByTokenContractAddress(transferredToken) as Token)
  const tokenList = TOKEN_LIST.map(token => ({
    ...token,
    amount: l2Balance[token.unit]
      ? l2Balance[token.unit].amount / 10 ** l2Balance[token.unit].decimals
      : 0
  }))

  return (
    <div className="send-section" id="send">
      <SectionTitle>Send Token</SectionTitle>
      <TokenSelector
        tokenList={tokenList}
        onSelected={setTransferredToken}
        selectedToken={transferredTokenObj}
      />
      <TokenInput
        className="mts mbs"
        value={transferredAmount}
        unit={transferredTokenObj.unit}
        handleAmount={setTransferredAmount}
      />
      <AddressInput className="mbs" handleAddress={setRecepientAddress} />
      <Button
        full
        onClick={() => {
          transfer(transferredAmount, transferredToken, recepientAddress)
        }}
        disabled={isAbleToTransfer}
      >
        Send
      </Button>

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

const mapStateToProps = (state: AppState) => ({
  l2Balance: state.l2Balance.balanceList,
  isAbleToTransfer: isAbleToTransfer(state),
  transferredToken: state.transferState.transferredToken,
  transferredAmount: state.transferState.transferredAmount,
  recepientAddress: state.transferState.recepientAddress
})

const mapDispatchToProps = {
  setTransferredToken,
  setTransferredAmount,
  setRecepientAddress,
  transfer
}
export default connect(mapStateToProps, mapDispatchToProps)(Send)
