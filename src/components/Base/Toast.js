import React from 'react'
import classnames from 'classnames'
import { CSSTransition } from 'react-transition-group'
import { White, ERROR, SUBTEXT } from '../../constants/colors'
import { FW_BOLD } from '../../constants/fonts'

export default ({ isShown, children, type = 'error', onClose }) => {
  return (
    <>
      <CSSTransition
        in={isShown}
        timeout={300}
        classNames="toast"
        unmountOnExit
      >
        <div className="toast">
          <div
            className={classnames('toast__head', {
              [`toast__head--${type}`]: true
            })}
          >
            <img src={`/icon-${type}.svg`} width="22" />
          </div>
          <div className="toast__body">{children}</div>
          <div className="toast__btn" onClick={onClose}>
            <img src="/icon-close-gray.svg" width="10" />
          </div>
        </div>
      </CSSTransition>
      <style jsx>{`
        .toast {
          position: fixed;
          right: 1rem;
          bottom: 1rem;
          padding: 0.5rem 1.5rem 0.5rem 0.5rem;
          display: flex;
          border-radius: 0.625rem;
          width: 18rem;
          min-height: 4.5rem;
          box-shadow: 0px 2px 54px rgba(123, 116, 168, 0.1);
          background: ${White()};
          overflow: hidden;
          color: ${SUBTEXT};
          font-weight: ${FW_BOLD};
          line-height: 1.35;
          transition: opacity 300ms ease, transform 300ms ease;
        }
        .toast__head {
          flex-basis: 2.5rem;
          margin: -0.5rem;
          margin-right: 0.625rem;
          padding: 0.5rem 0 0;
          text-align: center;
        }
        .toast__body {
          flex: 1;
        }
        .toast__head--error {
          background: ${ERROR};
        }
        .toast__btn {
          position: absolute;
          top: 0.375rem;
          right: 0.625rem;
          cursor: pointer;
        }
        .toast-enter {
          opacity: 0;
          transform: translateX(10rem);
        }
        .toast-enter-done {
          opacity: 1;
          transform: translateX(0);
        }
        .toast-exit {
          opacity: 1;
        }
        .toast-exit-active {
          opacity: 0;
          transform: scale(0.9);
        }
      `}</style>
    </>
  )
}
