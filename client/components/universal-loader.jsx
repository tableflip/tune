import React from 'react'
import Loader from './loader'

var loaderShown = false
var instanceUpdaters = []
var index = 1

export const UniversalLoader = React.createClass({
  componentWillMount () {
    instanceUpdaters.push(this.forceUpdate.bind(this))
  },
  componentWillUnmount () {
    instanceUpdaters = instanceUpdaters.filter(updater => updater !== this.forceUpdate)
  },
  getInitialState () {
    return { show: false }
  },
  render () {
    return loaderShown ? (<Loader options={{position: 'relative'}} {...this.props} />) : null
  }
})

export const showLoader = function(state) {
  loaderShown = state
  instanceUpdaters.forEach(updater => updater())
}
