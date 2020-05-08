import _ from 'lodash'
import { TOKEN_LIST } from '../tokens'
import {
  FZ_MEDIUM,
  FW_BLACK,
  FZ_HEADLINE,
  FZ_SMALL,
  FW_BOLD,
  FW_NORMAL
} from '../fonts'
import { SUBTEXT, BORDER } from '../colors'
import Button from './Base/Button'
import { Fragment } from 'react'
import { useRouter } from 'next/router'
import { openModal, PAYMENT } from '../routes'

export const WalletTokenItem = ({ l2, mainchain, unit }) => {
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
          {l2 ? (
            <Fragment>
              <div className="layer__amount">
                {l2.toFixed(2)}
                {/* <span className="layer__dollar">
                  = {(l2 * 100).toFixed(2)} USD
                </span> */}
              </div>
              <div className="btns">
                <div className="btn">
                  <Button
                    size="medium"
                    border
                    onClick={() => {
                      openModal('withdraw')
                    }}
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
                  >
                    Send
                  </Button>
                </div>
                <div className="btn">
                  <Button
                    size="medium"
                    onClick={() => {
                      openModal('orderRequest')
                    }}
                  >
                    Exchange
                  </Button>
                </div>
              </div>
            </Fragment>
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
          <div className="layer__amount">
            {mainchain.toFixed(2)}
            {/* <span className="layer__dollar">
              = {(mainchain * 100).toFixed(2)} USD
            </span> */}
          </div>
          <div className="btns">
            <div className="btn">
              <Button
                size="medium"
                border
                onClick={() => {
                  openModal('deposit')
                }}
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
