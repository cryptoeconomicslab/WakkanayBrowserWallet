import React from 'react'
import { css } from '@emotion/core'
import ClipLoader from 'react-spinners/ClipLoader'
import { Black } from '../../constants/colors'

const override = css`
  text-align: center;
`
const SyncingLoader = () => (
  <div className="clipLoaderBox">
    <ClipLoader css={override} size={48} color={Black(0.8)} />
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

export default SyncingLoader
