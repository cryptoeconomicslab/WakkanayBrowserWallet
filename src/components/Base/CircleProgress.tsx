import React from 'react'
import { Circle } from 'rc-progress'
import { MAIN } from '../../constants/colors'
import { FZ_TINY } from '../../constants/fonts'

type Props = {
  percent: number
}

export default ({ percent }: Props) => {
  return (
    <div className="circleBoxWrapper">
      <div className="circleBox">
        <Circle percent={percent} strokeWidth={8} strokeColor={MAIN} />
        <span className="circleBox__progress-character">
          syncing...{percent}%
        </span>
        <style jsx>{`
          .circleBoxWrapper {
            position: relative;
          }
          .circleBox {
            text-align: center;
            position: absolute;
            right: 48px;
            bottom: 32px;
            width: 48px;
          }
          .circleBox__progress-character {
            font-size: ${FZ_TINY};
          }
        `}</style>
      </div>
    </div>
  )
}
