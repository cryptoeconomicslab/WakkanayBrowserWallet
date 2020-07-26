import Link from 'next/link'
import { MAIN, Main, MAIN_DARK, White } from '../constants/colors'
import { FW_NORMAL, FZ_MEDIUM } from '../constants/fonts'
import { useRouter } from 'next/router'
import { connect } from 'react-redux'
import { HISTORY, PAYMENT } from '../routes'

const Header = ({ appRouter, appStatus }) => {
  const router = useRouter()

  const LinkWrap = ({ children }) =>
    appRouter.routeHistory.length < 2 ? (
      <Link href={PAYMENT} passHref>
        {children}
      </Link>
    ) : (
      <span
        onClick={() => {
          router.back()
        }}
      >
        {children}
      </span>
    )

  return (
    <div className="header">
      {router.pathname !== HISTORY ? (
        <>
          <h1 className="title">
            <Link href={PAYMENT} passHref>
              <img src="/logo.svg" width="158" />
            </Link>
          </h1>
          {appStatus.status === 'loaded' && (
            <Link href={HISTORY} passHref>
              <a className="historyButton">
                <img
                  src="/icon-history.svg"
                  width="14"
                  className="historyButton__img"
                />
                <span className="historyButton__txt">History</span>
              </a>
            </Link>
          )}
        </>
      ) : (
        <>
          <div />
          {appStatus.status === 'loaded' && (
            <LinkWrap>
              <a className="historyButton fill">
                <img
                  src="/icon-close.svg"
                  width="10"
                  className="historyButton__img"
                />
                <span className="historyButton__txt">Close</span>
              </a>
            </LinkWrap>
          )}
        </>
      )}
      <style jsx>{`
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
          padding: 0 1.25rem;
        }
        .title {
          display: flex;
          align-items: center;
          flex-basis: 126px;
          height: 100%;
          padding-right: 4vw;
          flex: 1;
        }
        .title img {
          cursor: pointer;
        }
        .historyButton {
          display: flex;
          align-items: center;
          padding: 0.5rem 1.25rem;
          border: 1px solid ${MAIN};
          color: ${MAIN};
          font-weight: ${FW_NORMAL};
          text-decoration: none;
          border-radius: 2rem;
          cursor: pointer;
        }
        .historyButton:hover {
          background: ${Main(0.05)};
        }
        .fill {
          background: ${MAIN};
          border: 1px solid ${MAIN};
          color: ${White()};
        }
        .fill:hover {
          background: ${MAIN_DARK};
          border: 1px solid ${MAIN_DARK};
        }
        .historyButton__img {
          margin-right: 0.375rem;
        }
        .historyButton__txt {
          font-size: ${FZ_MEDIUM};
        }
      `}</style>
    </div>
  )
}

const mapStateToProps = state => ({
  appRouter: state.appRouter,
  appStatus: state.appStatus
})

export default connect(mapStateToProps, undefined)(Header)
