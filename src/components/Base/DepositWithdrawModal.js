import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { BaseModal } from './BaseModal'
import Message from './Message'
import Button from './Button'
import { TokenSelector } from '../TokenSelector'
import Confirmation from '../Confirmation'
import TokenInput from '../TokenInput'
import { config } from '../../config'
import { DEPOSIT_PROGRESS } from '../../store/deposit'
import { TEXT_ERROR, SUBTEXT } from '../../constants/colors'
import { FZ_MEDIUM, FW_BLACK } from '../../constants/fonts'
import { getTokenByTokenContractAddress } from '../../constants/tokens'

const modalTexts = {
  deposit: {
    title: 'Deposit from Mainchain',
    inputButton: 'Deposit',
    confirmTitle: 'You will deposit',
    confirmText: '',
    completeTitle: 'Deposit Completed!'
  },
  withdraw: {
    title: 'Withdraw Funds from Mainchain Account',
    inputButton: 'Withdraw',
    confirmTitle: 'You will withdraw',
    confirmText: 'Withdrawals need to go through a period (about a week)',
    completeTitle: 'Withdraw Completed!'
  }
}

const DepositWithdrawModal = ({ type, progress, setProgress, action }) => {
  const router = useRouter()
  const [tokenAmount, setTokenAmount] = useState(undefined)
  const [token, setToken] = useState(router.query.token || config.PlasmaETH)

  const updateToken = selectedTokenContractAddress => {
    setToken(selectedTokenContractAddress)
  }

  const updateProgress = _progress => () => {
    setProgress(_progress)
  }

  const selectedTokenObj = getTokenByTokenContractAddress(token)

  return (
    <BaseModal
      title={modalTexts[type].title}
      onClose={updateProgress(DEPOSIT_PROGRESS.INPUT)}
      render={({ close }) => (
        <>
          <div className="depositWithdrawModal">
            {progress === DEPOSIT_PROGRESS.INPUT ? (
              <>
                <TokenSelector
                  onSelected={updateToken}
                  selectedToken={selectedTokenObj}
                />
                <TokenInput
                  className="mts mbs"
                  value={tokenAmount}
                  unit={selectedTokenObj.unit}
                  handleAmount={setTokenAmount}
                />
                <Button
                  size="full"
                  disabled={!tokenAmount}
                  onClick={updateProgress(DEPOSIT_PROGRESS.CONFIRM)}
                >
                  {modalTexts[type].inputButton}
                </Button>
              </>
            ) : progress === DEPOSIT_PROGRESS.CONFIRM ? (
              <Confirmation
                type={type}
                tokenAmount={tokenAmount}
                unit={selectedTokenObj.unit}
                imgSrc={selectedTokenObj.imgSrc}
                supplement={modalTexts[type].confirmText}
                onCancel={close}
                onConfirm={() => action(tokenAmount, token)}
              />
            ) : progress === DEPOSIT_PROGRESS.COMPLETE ? (
              <div className="complete">
                <img src="popper.svg" className="complete__img" />
                <div className="complete__txt">
                  {modalTexts[type].completeTitle}
                </div>
                <Button full border onClick={close}>
                  Close
                </Button>
              </div>
            ) : (
              <>
                <Message color={TEXT_ERROR}>
                  Something went wrong.
                  <br />
                  Please try again later.
                </Message>
                <Button full border onClick={close}>
                  Close
                </Button>
              </>
            )}
          </div>
          <style jsx>{`
            .depositWithdrawModal {
              min-width: 18.75rem;
            }
            .complete {
              text-align: center;
            }
            .complete__txt {
              margin: 0.5rem 0 1rem;
              font-size: ${FZ_MEDIUM};
              font-weight: ${FW_BLACK};
              color: ${SUBTEXT};
            }
          `}</style>
        </>
      )}
    ></BaseModal>
  )
}

export default DepositWithdrawModal
