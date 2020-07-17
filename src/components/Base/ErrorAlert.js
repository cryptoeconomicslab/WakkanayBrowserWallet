import React from 'react'
import { TEXT_ERROR } from '../../constants/colors'

// TODO: implement alert style
export default props => {
  const errorMessages = props.children.map(errorMessage => {
    return <li>{errorMessage}</li>
  })
  return (
    <div>
      <ul>{errorMessages}</ul>
      <style jsx>{`
        div {
          color: ${TEXT_ERROR};
          padding: 0.5rem;
          margin-bottom: 1rem;
          border-radius: 2px;
        }
      `}</style>
    </div>
  )
}
