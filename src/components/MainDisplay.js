const MainDisplay = props => {
  return (
    <div className="main-display">
      <div className="pages">{props.children}</div>
      <style jsx>{`
        .main-display {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
        }
        .pages {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow: scroll;
        }
      `}</style>
    </div>
  )
}
export default MainDisplay
