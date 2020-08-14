import { useState } from 'react'
import { connect } from 'react-redux'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import classnames from 'classnames'
import { SectionTitle } from '../components/SectionTitle'
import {
  SUBTEXT,
  BACKGROUND,
  MAIN,
  White,
  MAIN_DARK
} from '../constants/colors'
import { FW_NORMAL, FW_BLACK, FZ_MEDIUM, FW_BOLD } from '../constants/fonts'

const Receive = ({ address }) => {
  const [copied, setCopied] = useState(false)

  const updateCopy = currentCopied => () => {
    setCopied(currentCopied)
  }

  return (
    <div className="receive-section" id="receive">
      <SectionTitle>Receive Token</SectionTitle>
      <div className="receive-txt">
        Copy your wallet address below and tell him/her.
      </div>
      <div className="receive-row">
        <div className="receive-address">{address}</div>
        <CopyToClipboard
          text={address}
          onCopy={updateCopy(true)}
          disable={copied}
        >
          <div
            className={classnames('receive-btn', {
              copied
            })}
            onMouseLeave={updateCopy(false)}
          >
            {copied ? 'Copied!' : 'Copy'}
          </div>
        </CopyToClipboard>
      </div>
      <style jsx>{`
        .receive-section {
          position: relative;
          margin-top: 2rem;
          margin-bottom: 0.5rem;
        }
        .receive-row {
          display: flex;
          margin-top: 0.5rem;
        }
        .receive-txt {
          color: ${SUBTEXT};
          font-weight: ${FW_NORMAL};
          margin-top: 1.25rem;
          font-size: ${FZ_MEDIUM};
        }
        .receive-address {
          display: block;
          border-radius: 2rem;
          padding: 0.5rem 0.75rem;
          font-size: ${FZ_MEDIUM};
          font-weight: ${FW_BOLD};
          background: ${BACKGROUND};
          flex: 1;
        }
        .receive-btn {
          background: ${MAIN};
          display: block;
          border-radius: 2rem;
          cursor: pointer;
          padding: 0.5rem 1.5rem;
          margin-left: 0.5rem;
          font-size: ${FZ_MEDIUM};
          font-weight: ${FW_BOLD};
          background: ${MAIN};
          color: ${White()};
        }
        .receive-btn.copied {
          opacity: 0.3;
        }
        .receive-btn:hover {
          background: ${MAIN_DARK};
        }
        strong {
          font-weight: ${FW_BLACK};
        }
      `}</style>
    </div>
  )
}

const mapStateToProps = state => ({
  address: state.address
})
export default connect(mapStateToProps)(Receive)
