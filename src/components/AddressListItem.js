import { BOLD, EXTRABOLD, XSMALL, SMALLER, XXSMALL } from '../fonts'
import { PRIMARY_BUTTON_TEXT, White, BORDER_DARK } from '../colors'
import classNames from 'classnames'

import React, { useState } from 'react'

export default ({
  addressListItem,
  editAddressListItem,
  setEditedName,
  setEditedAddress,
  removeAddressListItem,
  editedNameRef,
  editedAddressRef,
  editedName,
  editedAddress
}) => {
  const [updateButtonToggle, setUpdateButtonToggle] = useState(false)
  const [borderBottomToggle, setBorderBottomToggle] = useState(false)
  return (
    <div key={addressListItem.id} className="address-book-item">
      <div
        className={classNames(
          borderBottomToggle
            ? 'item-container-with-border'
            : 'item-container-without-border',
          'item-container'
        )}
      >
        <div className="name-cell">
          <span className="name">
            {addressListItem.name === editedName ? (
              <input
                placeholder="NAME"
                defaultValue={addressListItem.name}
                className="edit-name-input"
                type="text"
                ref={editedNameRef}
              />
            ) : (
              addressListItem.name
            )}
          </span>
        </div>
        <div className="address-cell">
          {addressListItem.address === editedAddress ? (
            <input
              placeholder="ADDRESS"
              defaultValue={addressListItem.address}
              className="edit-address-input"
              type="text"
              ref={editedAddressRef}
            />
          ) : (
            <span className="address">{addressListItem.address}</span>
          )}
        </div>
      </div>
      {updateButtonToggle ? (
        <div
          className="update-button"
          onClick={() => {
            if (
              editedAddress === addressListItem.address ||
              editedName === addressListItem.name
            ) {
              editAddressListItem({
                id: addressListItem.id,
                name: editedNameRef.current.value,
                address: editedAddressRef.current.value
              })
              setEditedAddress(null)
              setEditedName(null)
            }
            setUpdateButtonToggle(false)
            setBorderBottomToggle(false)
          }}
        >
          Update
        </div>
      ) : (
        <div className="buttons-container">
          <button className="edit-button">
            <img
              src="../pencil.png"
              width="24px"
              alt="edit-button"
              onClick={() => {
                setEditedAddress(addressListItem.address)
                setEditedName(addressListItem.name)
                setUpdateButtonToggle(true)
                setBorderBottomToggle(true)
              }}
            />
          </button>
          <button className="remove-button">
            <img
              src="../trash-box.png"
              width="24px"
              alt="remove-button"
              onClick={() => {
                removeAddressListItem(addressListItem.id)
              }}
            />
          </button>
          <button className="send-button">Send</button>
        </div>
      )}

      <style jsx>{`
        .address-book-item {
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: ${SMALLER};
          font-weight: 500;
        }
        .address-book-item:hover .buttons-container {
          display: flex;
          align-items: center;
        }
        .item-container-with-border {
          border-bottom: 1px solid ${BORDER_DARK};
        }
        .item-container {
          width: calc(100% - 87px);
          display: flex;
        }
        .item-container:focus-within {
          border-bottom: 1px solid #2baef8;
        }
        .name-cell {
          margin-bottom: 12px;
          width: 100px;
          color: ${White(0.74)};
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .address-cell {
          margin-bottom: 12px;
          width: calc(100% - 100px);
          color: ${White(0.74)};
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .address {
          padding-left: 12px;
        }
        .edit-name-input,
        .edit-address-input {
          height: 14px;
          font-weight: 800;
          font-size: ${XSMALL};
          border: none;
          background-color: transparent;
          color: ${White(0.7)};
        }
        .edit-name-input {
          width: 100px;
        }
        .edit-address-input {
          width: calc(100% - 100px);
          padding-left: 12px;
          border-left: 1px solid ${BORDER_DARK};
        }
        .edit-name-input:focus + .edit-address-input {
          border-left: 1px solid #2baef8;
        }
        .edit-address-input:focus {
          border-left: 1px solid #2baef8;
        }
        .edit-name-input::placeholder,
        .edit-address-input::placeholder {
          font-size: ${XSMALL};
          font-weight: ${BOLD};
          color: ${BORDER_DARK};
        }
        .buttons-container {
          display: none;
        }
        .edit-button,
        .remove-button {
          width: 24px;
          height: 24px;
          cursor: pointer;
          margin-left: 9px;
          background-color: transparent;
        }
        .send-button {
          margin-left: 15px;
          border-radius: 40px;
          width: 73px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: ${White(0.06)};
          color: ${PRIMARY_BUTTON_TEXT};
          cursor: pointer;
          font-size: ${XXSMALL};
          font-weight: ${EXTRABOLD};
        }
        .send-button:hover {
          background-color: #eb3959;
        }
        .update-button {
          border-radius: 40px;
          margin-left: 18px;
          width: 87px;
          height: 36px;
          background: linear-gradient(122.3deg, #ec8383 0.21%, #c13087 93.55%);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: ${EXTRABOLD};
          font-size: ${SMALLER};
          color: ${PRIMARY_BUTTON_TEXT};
        }
      `}</style>
    </div>
  )
}
