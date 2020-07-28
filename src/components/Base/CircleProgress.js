import { Circle } from 'rc-progress'

export default ({ percent }) => {
  return (
    <div className="circleBoxWrapper">
      <div className="circleBox">
        <Circle percent={percent} strokeWidth="16" strokeColor="#D3D3D3" />
        <style jsx>{`
          .circleBoxWrapper {
            position: relative;
          }
          .circleBox {
            position: absolute;
            right: 48px;
            bottom: 32px;
            width: 32px;
          }
        `}</style>
      </div>
    </div>
  )
}
