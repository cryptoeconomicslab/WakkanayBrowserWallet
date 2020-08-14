import ClickOutside from 'react-click-outside'
import { BACKGROUND } from '../constants/colors'
import React, { useState } from 'react'
import DropdownContent from './DropdownContent'
const Dropdown = ({
  onselect,
  topButtonName,
  items,
  renderItem,
  width,
  selectedItem
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const selectItem = item => {
    onselect(item.tokenContractAddress)
    setIsOpen(false)
  }

  return (
    <>
      <ClickOutside onClickOutside={() => setIsOpen(false)}>
        <div className="dropdown">
          <button
            className="dropdown-button"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="top-button-name">{topButtonName(selectedItem)}</div>
          </button>
          {isOpen && (
            <DropdownContent
              onSelect={selectItem}
              renderItem={renderItem}
              items={items}
            />
          )}
        </div>
      </ClickOutside>
      <style jsx>{`
        .dropdown {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .dropdown-button {
          background: ${BACKGROUND};
          background-image: url('/icon-chevron-down.svg');
          background-repeat: no-repeat;
          background-position: calc(100% - 1.25rem) 50%;
          border-radius: 1.75rem;
          display: flex;
          justify-content: center;
          align-items: center;
          width: ${width ? width : '100%'};
          height: 100%;
          border: none;
          cursor: pointer;
          position: relative;
          color: #ffffff;
        }
        .top-button-name {
          width: 100%;
        }
      `}</style>
    </>
  )
}

export default Dropdown
