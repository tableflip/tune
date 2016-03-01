import React from 'react'

export default React.createClass({
  render () {
    return (
      <div>
        <h1>This is the homepage</h1>
        <a href="/dashboard">Dashboard</a>
        <br />
        <a href="/login">Login with github</a>
      </div>
    )
  }
})
