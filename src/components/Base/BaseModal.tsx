import React from 'react'
import Router from 'next/router'
import ClickOutside from 'react-click-outside'
import {
  MODAL_BACKGROUND,
  MODAL_MAIN_BACKGROUND,
  TEXT
} from '../../constants/colors'

interface Props {
  title: string
  render: any
  onClose: any
}

const BaseModal = ({ title, render, onClose }: Props) => {
  const close = () => {
    Router.push(Router.route)
    if (onClose) onClose()
  }

  return (
    <div className="modalBackground">
      <ClickOutside className="modal" onClickOutside={close}>
        <div className="modal__contents">
          <h2 className="modal__title">{title}</h2>
          <div className="modal__body">{render({ close })}</div>
        </div>
      </ClickOutside>
      <style jsx>{`
        .modalBackground {
          position: fixed;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          background: ${MODAL_BACKGROUND};
          display: flex;
          justify-content: center;
          align-items: center;
        }
        :global(.modal) {
          max-width: 30rem;
          background: ${MODAL_MAIN_BACKGROUND};
          opacity: 1;
          border-radius: 1.875rem;
          display: flex;
        }
        .modal__contents {
          padding: 2rem;
        }
        .modal__title {
          color: ${TEXT};
          text-align: center;
          margin-top: 0.5rem;
          margin-bottom: 1.25rem;
        }
        .modal__body {
        }
      `}</style>
    </div>
  )
}

export default BaseModal
