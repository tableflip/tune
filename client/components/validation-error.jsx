import React from 'react'

export default React.createClass({
  render () {
    if (!this.props.message) return null
    return (<div className="alert alert-danger" role="alert">{this.props.message}</div>)
  }
})
