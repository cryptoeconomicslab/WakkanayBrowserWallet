import React from 'react'
import { SMALL, MEDIUM } from '../constants/fonts'
import { Token } from '../constants/tokens'
import Dropdown from './Dropdown'

type Props = {
  onSelected: (selectedTokenContractAddress: string) => void
  selectedToken: Token
  tokenList: Token[]
  width?: string | number
}

/**
 * Token selector form item
 * @param {*} props
 */
const TokenSelector = ({
  onSelected,
  width,
  tokenList,
  selectedToken
}: Props): JSX.Element => {
  return (
    <div className="tokenSelector">
      <Dropdown
        onSelected={(selectedTokenContractAddress: string) => {
          onSelected(selectedTokenContractAddress)
        }}
        width="100%"
        selectedItem={selectedToken}
        tokenList={tokenList}
      />

      <style jsx>{`
        .tokenSelector {
          ${width ? `width: ${width}px;` : ''}
        }
        .tokenSelector :global(.dropdown-button) {
          font-size: ${SMALL};
          font-weight: 400;
        }
        .tokenSelector :global(.dropdown-caret) {
          font-size: ${MEDIUM};
        }
      `}</style>
    </div>
  )
}

export default TokenSelector
