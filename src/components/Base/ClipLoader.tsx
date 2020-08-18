import React from 'react'
import { css } from '@emotion/core'
import ClipLoader from 'react-spinners/ClipLoader'
import { Black } from '../../constants/colors'

type Props = {
  isLoading: boolean
}
const override = css`
  text-align: center;
`
export default ({ isLoading }: Props) => (
  <div className="clipLoaderBox">
    <ClipLoader
      css={override}
      size={48}
      color={Black(0.8)}
      loading={isLoading}
    />
    <style jsx>
      {`
        .clipLoaderBox {
          position: fixed;
          right: 48px;
          bottom 32px;
        }`}
    </style>
  </div>
)
