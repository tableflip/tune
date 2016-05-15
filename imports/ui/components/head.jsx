import React from 'react'
import Helmet from 'react-helmet'

export default function () {
  return (
    <Helmet
      defaultTitle='Tune by TABLEFLIP'
      titleTemplate='Tune - %s'
      meta={[
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no' },
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' }
      ]}
      link={[
        { rel: 'stylesheet', type: 'text/css', href: 'https://fonts.googleapis.com/css?family=Biryani:700' }
      ]}
    />
  )
}
