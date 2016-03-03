import React from 'react'
import { LoginWithGithub } from '../components/login-with-github'
import { Navbar } from '../components/navbar'

export default React.createClass({
  render () {
    return (
      <div>
        <Navbar />
        <div className="jumbotron">
          <a className="btn btn-lnk pull-xs-right" href="/dashboard">Dashboard</a>
          <LoginWithGithub />
        </div>
      </div>
    )
  }
})
