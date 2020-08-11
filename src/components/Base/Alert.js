import { FZ_SMALL } from '../../constants/fonts'
import { WARNING, WARNING_BACK } from '../../constants/colors'

export default ({ children }) => {
  return (
    <>
      <div className="attention">
        <img src="/icon-info.svg" className="attention__icon" />
        <div className="attention__body">{children}</div>
      </div>
      <style jsx>{`
        .attention {
          font-size: ${FZ_SMALL};
          color: ${WARNING};
          padding: 0.75rem;
          border: 1px solid ${WARNING};
          background: ${WARNING_BACK};
          display: flex;
          align-items: stretch;
          border-radius: 0.625rem;
          line-height: 1.45;
        }
        .attention__icon {
          flex-basis: 1rem;
          margin: 0 0.75rem 0 0;
        }
        .attention__body {
          flex: 1;
        }
      `}</style>
    </>
  )
}
