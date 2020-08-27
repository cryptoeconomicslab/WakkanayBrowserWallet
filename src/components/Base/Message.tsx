import React, { ReactNode } from 'react'
import { MAIN } from '../../constants/colors'

type Props = {
  children: ReactNode
  color?: string
}

const Message = ({ children, color }: Props) => (
  <p>
    {children}
    <style jsx>{`
      p {
        margin: 1rem;
        color: ${color || MAIN};
      }
    `}</style>
  </p>
)

export default Message
