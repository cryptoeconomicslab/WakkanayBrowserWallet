import React, { ReactNode } from 'react'
import { MAIN } from '../../constants/colors'

type Props = {
  children: ReactNode
  color?: string
}

export default ({ children, color }: Props) => (
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
