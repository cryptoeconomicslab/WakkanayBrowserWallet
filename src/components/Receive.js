import { connect } from 'react-redux'

import { SUBTEXT, BACKGROUND, SECTION_BACKGROUND, BORDER_DARK } from '../colors'
import { SMALLER, SMALL } from '../fonts'
import { SectionTitle } from '../components/SectionTitle'

import QRCode from 'qrcode.react'

// clipboard
import { CopyToClipboard } from 'react-copy-to-clipboard'
import ReactTooltip from 'react-tooltip'

const Receive = props => {
  return (
    <div className="receive-section" id="receive">
      <SectionTitle>Receive Token</SectionTitle>
      <div className="address-box-wrapper">
        <div className="address-title">Your Wakkanay Wallet Address</div>
        <CopyToClipboard text={props.address}>
          <div className="address-box" data-tip="React-tooltip">
            {props.address}
          </div>
        </CopyToClipboard>
        <ReactTooltip place="bottom" type="dark" effect="solid">
          <span>Copy to Clipboard</span>
        </ReactTooltip>
      </div>
      <div className="qr-code-box">
        <QRCode
          className="qr-code"
          value={props.address}
          alt="Your QR Code"
          size={120}
          includeMargin={true}
        />
      </div>
      <style jsx>{`
        .receive-section {
          width: calc(100% - 40px);
          height: 160px;
          display: flex;
          flex-direction: column;
          padding: 20px;
          margin: 20px 0px;
          background-color: ${SECTION_BACKGROUND};
          position: relative;
        }
        .address-box-wrapper {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .address-title {
          font-size: ${SMALL};
          font-weight: 800;
          color: ${SUBTEXT};
        }
        .address-box {
          margin-top: 12px;
          height: 32px;
          width: 522px;
          background-color: ${BACKGROUND};
          font-size: ${SMALLER};
          font-weight: 800;
          color: ${SUBTEXT};
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 12px;
          cursor: pointer;
        }
        .address-box:hover {
          background-color: ${BORDER_DARK};
        }
        .qr-code-box {
          position: absolute;
          bottom: 20px;
          right: 20px;
        }
      `}</style>
    </div>
  )
}

const mapStateToProps = state => ({
  address: state.address
})

export default connect(mapStateToProps, undefined)(Receive)
