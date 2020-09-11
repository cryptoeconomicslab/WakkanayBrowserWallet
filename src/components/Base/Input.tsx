import React from 'react'
import classnames from 'classnames'
import { BACKGROUND, Black } from '../../constants/colors'
import { FZ_MEDIUM, FW_BOLD } from '../../constants/fonts'

type Props = {
  full: boolean
  placeholder: string
  type?: string
  className?: string
  value?: any
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFocus?: () => void
  onBlur?: () => void
}

const Input = (props: Props): JSX.Element => {
  const { full, className } = props
  return (
    <>
      <input
        {...props}
        className={`${classnames(className, {
          input: true,
          full
        })}`}
      />
      <style jsx>{`
        .input {
          background: ${BACKGROUND};
          padding: 1rem 1.25rem;
          border-radius: 1.875rem;
          display: block;
          font-size: ${FZ_MEDIUM};
          font-weight: ${FW_BOLD};
        }
        .full {
          width: 100%;
        }
        .input::placeholder {
          color: ${Black(0.1)};
        }
      `}</style>
    </>
  )
}

export default Input
