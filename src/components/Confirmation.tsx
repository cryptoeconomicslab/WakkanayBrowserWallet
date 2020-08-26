import React from 'react'
import { connect } from 'react-redux'
import Button from './Base/Button'
import ConfirmationLoader from './Base/ConfirmationLoader'
import { shortenAddress, roundBalance } from '../utils'
import { SUBTEXT, BACKGROUND, TEXT } from '../constants/colors'
import {
  FZ_HEADLINE,
  FW_BLACK,
  FZ_MEDIUM,
  FW_BOLD,
  FZ_SMALL
} from '../constants/fonts'

const Confirmation = ({
  /* Component */
  type,
  tokenAmount,
  unit,
  imgSrc,
  supplement,
  onCancel,
  onConfirm,
  isLoading,
  /* Redux */
  ethUsdRate,
  address
}) => {
  return (
    <div className="confirmation">
      <div className="confirmation__title">You will {type}</div>
      <div className="confirmation__token">
        <div className="confirmation__tokenLogoWrap">
          <img className="confirmation__tokenLogo" src={imgSrc} />
        </div>
        <div className="confirmation__tokenAmount">{tokenAmount}</div>
        <div className="confirmation__tokenUnit">{unit}</div>
        <div className="confirmation__tokenBalance">
          = {roundBalance(ethUsdRate * tokenAmount)} USD
        </div>
      </div>
      <div className="confirmation__address">
        from
        <span className="confirmation__addressCode">
          {shortenAddress(address)}
        </span>
        to your wallet
      </div>
      <div className="confirmation__btns">
        <Button
          full
          className="confirmation__btn"
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? (
            <ConfirmationLoader isLoading={isLoading} />
          ) : (
            <>Confirm</>
          )}
        </Button>
        <Button
          full
          border
          className="confirmation__btn"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
      <p className="confirmation__supplement">{supplement}</p>
      <style jsx>{`
        .confirmation {
        }
        .confirmation__title {
          font-size: 0.875rem;
          color: ${SUBTEXT};
        }
        .confirmation__token {
          display: flex;
          align-items: center;
          padding: 0.5rem;
          background: ${BACKGROUND};
          border-radius: 1.25rem;
          margin: 0.5rem 0;
          line-height: 1;
        }
        .confirmation__tokenLogoWrap {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          background-color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin-right: 0.5rem;
        }
        .confirmation__tokenLogo {
          height: 1.5rem;
        }
        .confirmation__tokenAmount {
          font-size: ${FZ_HEADLINE};
          font-weight: ${FW_BLACK};
        }
        .confirmation__tokenUnit {
          font-size: ${FZ_MEDIUM};
          font-weight: ${FW_BOLD};
          color: ${SUBTEXT};
          margin: 0 0.75rem;
        }
        .confirmation__tokenBalance {
          font-size: ${FZ_SMALL};
          color: ${SUBTEXT};
        }
        .confirmation__address {
          font-size: 0.875rem;
          color: ${SUBTEXT};
          text-align: right;
        }
        .confirmation__addressCode {
          color: ${TEXT};
          padding: 0 0.25rem;
          font-size: ${FZ_MEDIUM};
          font-weight: ${FW_BOLD};
        }
        .confirmation__btns {
          margin-top: 1rem;
        }
        :global(.confirmation__btn) + :global(.confirmation__btn) {
          margin-top: 0.5rem;
        }
        .confirmation__supplement {
          margin-top: 0.5rem;
          font-size: ${FZ_MEDIUM};
          font-weight: ${FW_BOLD};
          color: ${SUBTEXT};
          text-align: center;
        }
      `}</style>
    </div>
  )
}

const mapStateToProps = state => ({
  ethUsdRate: state.ethUsdRate.rate,
  address: state.address.item
})

export default connect(mapStateToProps)(Confirmation)
