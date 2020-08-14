import React from 'react'
import classNames from 'classnames'
import { BACKGROUND } from '../../constants/colors'
import { FW_BOLD, FZ_DEFAULT } from '../../constants/fonts'

export default props => {
  const { options } = props
  return (
    <>
      <div className="selectWrap">
        <select
          {...props}
          className={classNames({
            select: true
          })}
        >
          {options.map(({ label, value }) => (
            <option value={value} className="select__option">
              {label}
            </option>
          ))}
        </select>
      </div>
      <style jsx>{`
        .select {
          border: none;
          background: ${BACKGROUND};
          padding: 1rem 1.25rem;
          display: block;
          border-radius: 1.875rem;
          font-size: ${FZ_DEFAULT};
          font-weight: ${FW_BOLD};
          padding: 1rem 1.5rem 1rem 1rem;
          width: 100%;
          min-height: 100%;
          -moz-appearance: none;
          -webkit-appearance: none;
          background-image: url('/icon-chevron-down.svg');
          background-repeat: no-repeat;
          background-position: calc(100% - 1.5rem) 50%;
          background-size: 10px 6px;
        }
        .selectWrap {
          width: 100%;
          border-radius: 1.875rem;
        }
        .select__option {
          background-image: url('/tokenIcons/ethereum-logo.png');
        }
        .full {
          width: 100%;
        }
      `}</style>
    </>
  )
}
