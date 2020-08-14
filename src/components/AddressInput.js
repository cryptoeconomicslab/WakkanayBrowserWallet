import React, { useState } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import Input from './Base/Input'
import { BACKGROUND, MAIN } from '../constants/colors'

const AddressInput = props => {
  const { className, handleAddress, recepientAddress } = props
  const [focused, setFocused] = useState(false)
  return (
    <>
      <div
        className={`${classnames(className, {
          inputWrap: true,
          focused
        })}`}
      >
        <Input
          full
          value={recepientAddress}
          placeholder="0x0000000000000000000000000000000000000000"
          onFocus={() => {
            setFocused(true)
          }}
          onBlur={() => {
            setTimeout(() => {
              setFocused(false)
            }, 200)
          }}
          onChange={e => {
            handleAddress(e.target.value)
          }}
        />
      </div>
      <style jsx>{`
        .inputWrap {
          position: relative;
          background: ${BACKGROUND};
          border-radius: 1.875rem;
          padding-left: 1.75rem;
          border 1px solid ${focused ? MAIN : 'transparent'}
        }
      `}</style>
    </>
  )
}

const mapStateToProps = ({ transferState }) => ({
  recepientAddress: transferState.recepientAddress
})
export default connect(mapStateToProps)(AddressInput)
