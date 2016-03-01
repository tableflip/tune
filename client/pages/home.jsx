import React from 'react'
import { LoginWithGithub } from '../components/login-with-github'

export default React.createClass({
  render () {
    return (
      <div>
        <h1>This is the homepage</h1>
        <a href="/dashboard">Dashboard</a>
        <LoginWithGithub />
      </div>
    )
  }
})
