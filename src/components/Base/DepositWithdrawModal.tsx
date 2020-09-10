import React, { useState } from 'react'
import { useRouter } from 'next/router'
import BaseModal from './BaseModal'
import Message from './Message'
import Button from './Button'
import TokenSelector from '../TokenSelector'
import Confirmation from '../Confirmation'
import TokenInput from '../TokenInput'
import config from '../../config'
import { SUBTEXT, ERROR } from '../../constants/colors'
import { FZ_MEDIUM, FW_BLACK } from '../../constants/fonts'
import TOKEN_LIST, {
  getTokenByTokenContractAddress,
  Token
} from '../../constants/tokens'
import { DEPOSIT_WITHDRAW_PROGRESS } from '../../store/types'

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

type Props = {
  type: string
  progress: string
  setProgress: any
  action: any
  balance: any
}

const DepositWithdrawModal = ({
  type,
  progress,
  setProgress,
  action,
  balance
}: Props) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [tokenAmount, setTokenAmount] = useState<number | undefined>(undefined)
  const [token, setToken] = useState<string>(
    router.query.token || config.PlasmaETH
  )
  const updateToken = (selectedTokenContractAddress: string) => {
    setToken(selectedTokenContractAddress)
  }
  const updateProgress = (_progress: string) => () => {
    setProgress(_progress)
  }
  const selectedTokenObj: Token =
    getTokenByTokenContractAddress(token) === undefined
      ? TOKEN_LIST[0]
      : (getTokenByTokenContractAddress(token) as Token)
  const selectedTokenBalance: number =
    selectedTokenObj !== undefined && balance[selectedTokenObj.unit]
      ? balance[selectedTokenObj.unit].amount
      : 0
  const isInsufficientFunds = () => {
    if (!tokenAmount) return false
    return tokenAmount > selectedTokenBalance
  }
  return (
    <BaseModal
      title={modalTexts[type].title}
      onClose={updateProgress(DEPOSIT_WITHDRAW_PROGRESS.INPUT)}
      render={({ close }) => (
        <>
          <div className="depositWithdrawModal">
            {progress === DEPOSIT_WITHDRAW_PROGRESS.INPUT ? (
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
                {isInsufficientFunds() && (
                  <p className="depositWithdrawModal__insufficient-funds-message">
                    Insufficient funds. (your balance is {selectedTokenBalance}{' '}
                    {selectedTokenObj.unit})
                  </p>
                )}
                <Button
                  size="full"
                  disabled={!tokenAmount || isInsufficientFunds()}
                  onClick={updateProgress(DEPOSIT_WITHDRAW_PROGRESS.CONFIRM)}
                >
                  {modalTexts[type].inputButton}
                </Button>
              </>
            ) : progress === DEPOSIT_WITHDRAW_PROGRESS.CONFIRM ? (
              <Confirmation
                type={type}
                tokenAmount={tokenAmount}
                unit={selectedTokenObj.unit}
                imgSrc={selectedTokenObj.imgSrc}
                supplement={modalTexts[type].confirmText}
                isLoading={isLoading}
                onCancel={close}
                onConfirm={async () => {
                  setIsLoading(true)
                  await action(tokenAmount, token)
                  setIsLoading(false)
                }}
              />
            ) : progress === DEPOSIT_WITHDRAW_PROGRESS.COMPLETE ? (
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
                <Message color={ERROR}>
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
            .depositWithdrawModal__insufficient-funds-message {
              padding: 0rem 0.5rem 0.875rem;
              color: ${ERROR};
              font-size: ${FZ_MEDIUM};
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
