import React from 'react'

export default React.createClass({
  propTypes: {
    message: React.PropTypes.string
  },
  render () {
    if (!this.props.message) return null
    return (<div className='alert alert-danger' role='alert'>{this.props.message}</div>)
  }
})
