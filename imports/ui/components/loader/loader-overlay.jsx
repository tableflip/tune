import React from 'react'
import Loader from 'react-loader'
import LoaderStyle from './loader-style'

let style = {
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'transparent'
}

export default React.createClass({
  render () {
    if (this.props.loaded) return false
    return (
      <div style={style}>
        <Loader loaded={false} {...LoaderStyle()} />
      </div>
    )
  }
})
