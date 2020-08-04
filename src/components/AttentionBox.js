import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { ERROR } from '../constants/colors'
import { FW_BOLD, FZ_MEDIUM } from '../constants/fonts'

export default () => {
  return (
    <>
      <div className="attention-box">
        <FontAwesomeIcon icon={faExclamationTriangle} width={FZ_MEDIUM} />
        Please note that this wallet is the alpha version and there is a
        possibility of losing your deposited funds.
        <br />
        Also, you can get Kovan Ether (KETH) from{' '}
        <a href="https://faucet.kovan.network/" target="_blank" rel="noopener">
          here
        </a>
        .
      </div>
      <style jsx>{`
        .attention-box {
          font-size: ${FZ_MEDIUM};
          color: ${ERROR};
          font-weight: ${FW_BOLD};
          padding-bottom: 1.2rem;
        }
      `}</style>
    </>
  )
}
