import React from 'react'
import Loader from 'react-loader'

export default React.createClass({
  render () {
    if (this.props.loaded) return false
    let style = {
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.2)'
    }
    return (
      <div style={style}>
        <Loader />
      </div>
    )
  }
})
