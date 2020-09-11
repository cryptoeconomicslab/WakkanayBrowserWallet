import React, { useState } from 'react'
import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { BACKGROUND, MAIN } from '../constants/colors'
import { AppState } from '../store'
import Input from './Base/Input'

type Props = {
  className: string
  handleAddress: ActionCreatorWithPayload<string, string>
  recepientAddress: string
}

const AddressInput = ({
  className,
  handleAddress,
  recepientAddress
}: Props): JSX.Element => {
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
        <img src="/icon-user.svg" width={32} className="input__img" />
      </div>
      <style jsx>{`
        .inputWrap {
          position: relative;
          background: ${BACKGROUND};
          border-radius: 1.875rem;
          padding-left: 1.75rem;
          border 1px solid ${focused ? MAIN : 'transparent'}
        }
        .input__img {
          position: absolute;
          top: 0.5rem;
          left: 0.5rem;
          border-radius: 50%;
        }
      `}</style>
    </>
  )
}

const mapStateToProps = ({ transferState }: AppState) => ({
  recepientAddress: transferState.recepientAddress
})
export default connect(mapStateToProps)(AddressInput)
