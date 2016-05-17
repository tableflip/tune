import React from 'react'
import { connect } from 'react-redux'
import Loader from 'react-loader'
import LoaderStyle from './loader-style'

function mapStateToProps ({ spinnerVisible, subscriptions }) {
  return {loaded: !spinnerVisible && subscriptions.ready}
}

export default connect(mapStateToProps)((props) => (
  <Loader {...LoaderStyle()} {...props} />
))
