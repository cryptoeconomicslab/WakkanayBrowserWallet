import React from 'react'
import SelectItem from './SelectItem'

const TokenSelectButton = props => {
  return props.item ? (
    <SelectItem
      img={props.item.imgSrc}
      name={props.item.unit}
      supplement={
        props.item.amount !== undefined && props.item.amount !== null
          ? `${props.item.amount} ${props.item.unit}`
          : undefined
      }
      padding={props.padding}
    />
  ) : null
}

export default TokenSelectButton
