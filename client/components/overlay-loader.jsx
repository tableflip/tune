import React from 'react'
import Loader from './loader'

let style = {
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.2)'
}

export default React.createClass({
  render () {
    if (this.props.loaded) return false
    return (
      <div style={style}>
        <Loader options={{ position: 'relative', color: '#ddd' }} />
      </div>
    )
  }
})
