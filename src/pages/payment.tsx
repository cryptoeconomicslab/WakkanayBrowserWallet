import React from 'react'
import Layout from '../components/Layout'
import Send from '../components/Send'
import Receive from '../components/Receive'

const Payment = (): JSX.Element => {
  return (
    <Layout>
      <Send />
      <Receive />
    </Layout>
  )
}

export default Payment
