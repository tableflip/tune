import React from 'react'
import { connect } from 'react-redux'
import Loader from './loader'

const UniversalLoader = React.createClass({
  render () {
    return this.props.spinnerVisible ? (<Loader options={{position: 'relative'}} {...this.props} />) : null
  }
})

export default connect(state => state)(UniversalLoader)
