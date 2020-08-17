import React from 'react'
import { useRouter } from 'next/router'
import _ from 'lodash'
import Button from './Base/Button'
import { SUBTEXT, BORDER } from '../constants/colors'
import {
  FZ_MEDIUM,
  FW_BLACK,
  FZ_HEADLINE,
  FZ_SMALL,
  FW_BOLD,
  FW_NORMAL
} from '../constants/fonts'
import { TOKEN_LIST } from '../constants/tokens'
import { openModal, PAYMENT } from '../routes'
import { SYNCING_STATUS } from '../store/appStatus'

const WalletTokenItem = ({
  l1Balance,
  l2Balance,
  tokenContractAddress,
  unit,
  syncingStatus
}) => {
  const router = useRouter()
  const { imgSrc, imgAspect } = _.find(TOKEN_LIST, { unit })
  return (
    <div className="wrap">
      <div className="label">
        <img src={imgSrc} width={24 * imgAspect} className="label__img" />
        <span className="label__unit">{unit}</span>
      </div>
      <div className="row">
        <div className="layer l2">
          <div className="layer__label">L2</div>
          {l2Balance ? (
            <>
              <div className="layer__amount">{l2Balance.toFixed(2)}</div>
              <div className="btns">
                <div className="btn">
                  <Button
                    size="medium"
                    border
                    onClick={() => {
                      openModal({
                        modal: 'withdraw',
                        token: tokenContractAddress
                      })
                    }}
                    disabled={syncingStatus === SYNCING_STATUS.LOADING}
                  >
                    <img src="/withdraw-arrow.svg" className="btn__icon" />
                    Withdraw
                  </Button>
                </div>
                <div className="btn">
                  <Button
                    size="medium"
                    onClick={() => {
                      router.push(PAYMENT)
                    }}
                    disabled={syncingStatus === SYNCING_STATUS.LOADING}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="empty">
              <h3 className="empty__headline">No tokens</h3>
              <p className="empty__desc">
                First, you need to deposit token from Mainchain
              </p>
            </div>
          )}
        </div>
        <div className="layer mainchain">
          <div className="layer__label">mainchain</div>
          <div className="layer__amount">{l1Balance.toFixed(2)}</div>
          <div className="btns">
            <div className="btn">
              <Button
                size="medium"
                border
                onClick={() => {
                  openModal({ modal: 'deposit', token: tokenContractAddress })
                }}
                disabled={syncingStatus === SYNCING_STATUS.LOADING}
              >
                <img src="/deposit-arrow.svg" className="btn__icon" />
                Deposit
              </Button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .wrap + .wrap {
          border-top: 1px dashed ${BORDER};
          margin-top: 1.5rem;
          padding-top: 1.5rem;
        }
        .label {
          display: flex;
          align-items: center;
        }
        .label__unit {
          font-size: ${FZ_MEDIUM};
          font-weight: ${FW_BLACK};
          color: ${SUBTEXT};
          margin-left: 0.5rem;
        }
        .row {
          display: flex;
          margin-top: 1rem;
        }
        .l2 {
          flex: 3;
        }
        .mainchain {
          flex: 2;
        }
        .layer__label {
          font-size: ${FZ_MEDIUM};
          font-weight: ${FW_BLACK};
          color: ${SUBTEXT};
          margin-bottom: 0.5rem;
        }
        .layer__amount {
          font-size: ${FZ_HEADLINE};
          display: flex;
          align-items: center;
          line-height: 1;
        }
        .layer__dollar {
          margin-left: 0.25rem;
          font-size: ${FZ_SMALL};
          font-weight: ${FW_BOLD};
          color: ${SUBTEXT};
        }
        .btns {
          display: flex;
          margin-top: 0.75rem;
        }
        .btn + .btn {
          margin-left: 0.375rem;
        }
        .btn__icon {
          margin-left: -0.25rem;
          margin-right: 0.125rem;
        }
        .empty {
          color: ${SUBTEXT};
        }
        .empty__headline {
          font-weight: ${FW_BOLD};
          font-size: ${FZ_HEADLINE};
        }
        .empty__desc {
          margin-top: 0.5rem;
          font-size: ${FZ_SMALL};
          font-weight: ${FW_NORMAL};
        }
      `}</style>
    </div>
  )
}

export default WalletTokenItem
