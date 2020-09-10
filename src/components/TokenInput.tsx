import React, { useState } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import Input from './Base/Input'
import { BACKGROUND, PLACEHOLDER, SUBTEXT, MAIN } from '../constants/colors'
import { FZ_MEDIUM, FW_BOLD, FZ_SMALL } from '../constants/fonts'
import { AppState } from '../store'
import { roundBalance } from '../utils'

const TokenInput = props => {
  const {
    /* component */
    className,
    value,
    unit,
    handleAmount,
    /* redux */
    ethUsdRate
  } = props
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
          value={value}
          className="fzh"
          placeholder="0.0"
          onFocus={() => {
            setFocused(true)
          }}
          onBlur={() => {
            setFocused(false)
          }}
          onChange={e => {
            if (!e.target.value.match(/^[e0-9.+]+$/) && e.target.value) {
              return
            }
            handleAmount(e.target.value)
          }}
        />
        <div className="input__unit">{unit}</div>
        <div className="input__balance">
          = {roundBalance(ethUsdRate * (value || 0))} USD
        </div>
      </div>
      <style jsx>{`
        .inputWrap {
          position: relative;
          background: ${BACKGROUND};
          border-radius: 1.25rem;
          padding: 0.125rem 0 1.875rem;
          border 1px solid ${focused ? MAIN : 'transparent'}
        }
        .input__unit {
          position: absolute;
          right: 1.5rem;
          top: 1.25rem;
          color: ${PLACEHOLDER};
          font-size: ${FZ_MEDIUM};
          font-weight: ${FW_BOLD};
        }
        .input__balance {
          color: ${SUBTEXT};
          font-size: ${FZ_SMALL};
          position: absolute;
          right: 1.5rem;
          bottom: 0.875rem;
        }
      `}</style>
    </>
  )
}

const mapStateToProps = ({ ethUsdRate }: AppState) => ({
  ethUsdRate: ethUsdRate.rate
})
export default connect(mapStateToProps)(TokenInput)
