import React, { ReactNode } from 'react'
import { FW_BLACK, FZ_MEDIUM } from '../constants/fonts'
import { SUBTEXT } from '../constants/colors'

type Props = {
  children: ReactNode
}

const SectionTitle = ({ children }: Props): JSX.Element => {
  return (
    <div className="section-title">
      {children}
      <style jsx>{`
        font-weight: ${FW_BLACK};
        font-size: ${FZ_MEDIUM};
        color: ${SUBTEXT};
        margin-bottom: 0.625rem;
      `}</style>
    </div>
  )
}

export default SectionTitle
