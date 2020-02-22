import { EXTRABOLD, XSMALL, SMALLER, XXSMALL } from '../../fonts'
import { PRIMARY_BUTTON_TEXT, White } from '../../colors'

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
}) => (
  <tr key={addressListItem.id} className="address-list">
    <td className="name-section">
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
    </td>
    <td className="address-section">
      <div className="address-cell">
        <div className="address">
          {addressListItem.address === editedAddress ? (
            <input
              placeholder="ADDRESS"
              defaultValue={addressListItem.address}
              className="edit-address-input"
              type="text"
              ref={editedAddressRef}
            />
          ) : (
            addressListItem.address
          )}
        </div>
        <div className="button-container">
          <img
            src="../pencil.png"
            alt="edit-button"
            className="edit-button"
            onClick={() => {
              if (editedAddress === addressListItem.address) {
                editAddressListItem({
                  id: addressListItem.id,
                  name: addressListItem.name,
                  address: editedAddressRef.current.value
                })
                setEditedAddress(null)
              } else {
                setEditedAddress(addressListItem.address)
              }
            }}
          ></img>
          <img
            src="../trash-box.png"
            alt="remove-button"
            className="remove-button"
            onClick={() => {
              removeAddressListItem(addressListItem.id)
            }}
          ></img>
          <div className="send-button">Send</div>
        </div>
      </div>
    </td>
    <style jsx>{`
      th,
      td {
        height: 52px;
        padding: 8px;
      }
      .name-section,
      .address-section {
        padding: 8px;
        color: ${White(0.74)};
      }
      .name-cell {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .address-cell {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .button-container {
        display: flex;
        align-items: center;
      }
      .name {
        font-size: ${SMALLER};
        font-weight: 500;
      }
      .address {
        font-size: ${SMALLER};
        font-weight: 500;
      }
      .edit-name-input,
      .edit-address-input {
        width: 355px;
        height: 14px;
        font-weight: 800;
        font-size: ${XSMALL};
        border: none;
        background-color: transparent;
      }
      .edit-name-input::placeholder,
      .edit-address-input::placeholder {
        font-weight: 800;
        font-size: ${XSMALL};
      }
      .edit-name-input,
      .edit-address-input {
        width: 355px;
        height: 14px;
        font-weight: 800;
        font-size: ${XSMALL};
        color: white;
        opacity: 0.7;
      }
      .edit-button,
      .remove-button {
        width: 24px;
        height: 24px;
        cursor: pointer;
        margin-left: 9px;
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
    `}</style>
  </div>
)
