import React, { ReactNode } from 'react'
import classnames from 'classnames'
import { MAIN, White, MAIN_DARK, Main } from '../../constants/colors'
import { FZ_MEDIUM, FW_BLACK, FZ_SMALL } from '../../constants/fonts'

interface Props {
  children: ReactNode
  className?: string
  full?: any
  border?: any
  size?: any
  onClick?: any
  disabled?: boolean
}

const Button = (props: Props) => {
  const { full, size, className, border, children } = props
  return (
    <button
      {...props}
      className={`${classnames(className, {
        button: true,
        full,
        [size]: true,
        border
      })}`}
    >
      {children}
      <style jsx>{`
        .button {
          background: ${MAIN};
          color: ${White()};
          padding: 1rem 1.25rem;
          border-radius: 1.875rem;
          display: block;
          font-size: ${FZ_MEDIUM};
          font-weight: ${FW_BLACK};
        }
        .button:not(:disabled) {
          cursor: pointer;
        }
        .button:not(:disabled):hover {
          background: ${MAIN_DARK};
        }
        .button.full + .button.full {
          margin-top: 0.875rem;
        }
        .full {
          width: 100%;
        }
        .medium {
          font-size: ${FZ_SMALL};
          padding: 0.5rem 1.25rem;
        }
        .small {
          font-size: ${FZ_SMALL};
          padding: 0.25rem 0.75rem;
        }
        .tiny {
          font-size: ${FZ_SMALL};
          padding: 0.125rem 0.5rem;
        }
        .border {
          background: transparent;
          border: 1px solid ${MAIN};
          color: ${MAIN};
        }
        .border:not(:disabled):hover {
          background: ${Main(0.05)};
        }
        .button:disabled {
          opacity: 0.3;
        }
      `}</style>
    </button>
  )
}

export default Button
