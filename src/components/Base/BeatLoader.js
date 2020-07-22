import { css } from '@emotion/core'
import BeatLoader from 'react-spinners/BeatLoader'
import { Black } from '../../constants/colors'

const override = css`
  text-align: center;
`
export default ({ isLoading }) => {
  return (
    <div className="sweet-loading">
      <BeatLoader
        css={override}
        size={15}
        color={Black(1.0)}
        loading={isLoading}
      />
    </div>
  )
}
