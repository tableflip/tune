import React from 'react'
import { connect } from 'react-redux'
import Loader from './loader'

const UniversalLoader = React.createClass({
  render () {
    return (this.props.spinnerVisible || !this.props.subscriptions.ready) ? (<Loader options={{position: 'relative'}} {...this.props} />) : null
  }
})

function mapStateToProps ({ spinnerVisible, subscriptions }) {
  return { spinnerVisible, subscriptions }
}

export default connect(mapStateToProps)(UniversalLoader)
