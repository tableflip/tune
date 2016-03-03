import React from 'react'

export default React.createClass({
  propTypes: {
    url: React.PropTypes.string
  },
  render () {
    let block = {
      position: 'absolute',
      display: 'block',
      height: '380',
      width: '100%',
      background: 'transparent'
    }
    return (
      <div onClick={ this.stopPropergation }>
        <div style={ block }></div>
        <iframe src={ this.props.url } width='100%' height='380' border='no' scrolling='no' frameBorder='no'></iframe>
      </div>
    )
  }
})
