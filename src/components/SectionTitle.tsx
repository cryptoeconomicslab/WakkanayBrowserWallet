import { FW_BLACK, FZ_MEDIUM } from '../constants/fonts'
import { SUBTEXT } from '../constants/colors'

export const SectionTitle = props => {
  return (
    <div className="section-title">
      {props.children}
      <style jsx>{`
        font-weight: ${FW_BLACK};
        font-size: ${FZ_MEDIUM};
        color: ${SUBTEXT};
        margin-bottom: 0.625rem;
      `}</style>
    </div>
  )
}
