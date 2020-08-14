import { FZ_DEFAULT, FW_BOLD } from '../constants/fonts'
import { TEXT, PLACEHOLDER } from '../constants/colors'

export const SelectItem = ({ img, name, supplement, padding }) => {
  return (
    <div className="item">
      <div className="item__label">
        <div className="item__imgWrap">
          <img className="item__img" src={img} alt="" />
        </div>
        <div className="item__name">{name}</div>
      </div>
      {!!supplement && <div className="item__supplement">{supplement}</div>}
      <style jsx>{`
        .item {
          width: 100%;
          padding: ${padding || 0};
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
        }
        .item__label {
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        .item__imgWrap {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          background-color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .item__img {
          height: 1.5rem;
        }
        .item__name {
          margin-left: 0.5rem;
          font-size: ${FZ_DEFAULT};
          color: ${TEXT};
          font-weight: ${FW_BOLD};
        }
        .item__supplement {
          padding-right: 0.25rem;
          color: ${PLACEHOLDER};
        }
      `}</style>
    </div>
  )
}
