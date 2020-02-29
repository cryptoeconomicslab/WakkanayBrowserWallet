export const TokenSelectButton = props => {
  return (
    <div className="item-name-inner">
      <div className="selected-token-img-bg">
        <img
          className="selected-token-img"
          src="../tokenIcons/ethereum-logo.png"
          alt="Eth Logo"
        ></img>
      </div>
      <div className="token-name">{props.item.name}</div>
      <style jsx>{`
        .item-name-inner {
          width: 100%;
          padding: 8px ${props.padding};
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        .selected-token-img-bg {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 4px;
        }
        .selected-token-img {
          height: 22px;
        }
        .token-name {
          margin-left: 8px;
        }
      `}</style>
    </div>
  )
}
