import React from 'react'
import SelectItem from './SelectItem'
import { Token } from '../constants/tokens'

type Props = {
  item: Token
  padding: string
}

const TokenSelectButton = ({ item, padding }: Props): JSX.Element | null => {
  return item ? (
    <SelectItem
      img={item.imgSrc}
      name={item.unit}
      supplement={
        item.balance !== undefined && item.balance !== null
          ? `${item.balance} ${item.unit}`
          : undefined
      }
      padding={padding}
    />
  ) : null
}

export default TokenSelectButton
