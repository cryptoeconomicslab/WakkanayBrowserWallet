import React from 'react'
import { TEXT_ERROR } from '../../constants/colors'

// TODO: implement alert style
export default props => {
  return (
    <>
      {props.isShown && (
        <p>
          {props.children}
          <style jsx>{`
            p {
              color: ${TEXT_ERROR};
              padding: 0.5rem;
              margin-bottom: 1rem;
              border-radius: 2px;
            }
          `}</style>
        </p>
      )}
    </>
  )
}
