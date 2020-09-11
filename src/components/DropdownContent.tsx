import React from 'react'
import TokenSelectButton from './TokenSelectButton'
import { TEXT, SUBTEXT, BACKGROUND, White } from '../constants/colors'
import { Token } from '../constants/tokens'
import { Z_DROPDOWN } from '../constants/zindex'

type Props = {
  onSelect: (item: Token) => void
  tokenList: Token[]
}

const DropdownContent = ({ onSelect, tokenList }: Props): JSX.Element => {
  const selectItem = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    item: Token
  ) => {
    e.preventDefault()
    onSelect(item)
  }

  return (
    <>
      <div className="dropdown-content">
        {tokenList.map(item => (
          <div
            key={item.unit}
            className="dropdown-item"
            onClick={e => selectItem(e, item)}
          >
            <TokenSelectButton item={item} padding="0.5rem 0.5rem" />
          </div>
        ))}
      </div>
      <style jsx>{`
        .dropdown-content {
          z-index: ${Z_DROPDOWN};
          color: ${SUBTEXT};
          position: absolute;
          border-bottom: none;
          background: ${White()};
          border-radius: 1.5rem;
          left: 0;
          top: calc(100% - 0.25rem);
          width: 100%;
          box-shadow: 0px 2px 54px rgba(123, 116, 168, 0.1);
          padding: 0.5rem;
        }
        .dropdown-item {
          border-radius: 2rem;
          padding: 0 0.125rem;
        }
        .dropdown-item:hover {
          color: ${TEXT};
          background: ${BACKGROUND};
        }
      `}</style>
    </>
  )
}

export default DropdownContent
