import React from 'react'
import { Store } from 'redux'
import { Provider } from 'react-redux'
import App from 'next/app'
import withRedux from 'next-redux-wrapper'
import { ToastProvider } from 'react-toast-notifications'
import { makeStore } from '../store'
import Initial from '../components/Initial'

class MyApp extends App<{ store: Store }> {
  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {}

    return { pageProps }
  }

  render() {
    const { Component, pageProps, store } = this.props
    return (
      <Provider store={store}>
        <ToastProvider autoDismiss={true} autoDismissTimeout={3000}>
          <Initial>
            <Component {...pageProps} />
          </Initial>
        </ToastProvider>
      </Provider>
    )
  }
}

export default withRedux(makeStore)(MyApp)
