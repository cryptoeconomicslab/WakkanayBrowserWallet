import React from 'react'
import { useRouter } from 'next/router'
import { PAYMENT } from '../routes'

const Index = (): JSX.Element => {
  const router = useRouter()
  router.replace(PAYMENT)
  return <></>
}

export default Index
