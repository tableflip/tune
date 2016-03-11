import React from 'react'
import OverlayLoader from './overlay-loader'

export const LoginWithGithub = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData () {
    var user = Meteor.user()
    return {
      user: Meteor.user()
    }
  },
  getInitialState () {
    return { loginSpinner: false }
  },
  login () {
    this.setState({ loginSpinner: true })
    Meteor.loginWithGithub({ requestPermissions: ['repo'] }, this.setState.bind(this, { loginSpinner: false }))
  },
  logout () {
    Meteor.logout()
  },
  render () {
    if (this.data.user) {
      return (
        <div className="m-b-1">
          <p>Logged in as {this.data.user.profile.name}</p>
          <button className="btn btn-primary-outline" type="button" onClick={this.logout}>Log out</button>
        </div>
      )
    } else if (this.state.loginSpinner) {
      return (<OverlayLoader color='#ddd' position='relative' />)
    } else {
      return (
        <div>
          <p>&nbsp;</p>
          <button className="btn btn-primary btn-lg p-x-3" type="button" onClick={this.login} title="Click to login in via your Github account">Log in</button>
        </div>
      )
    }
  }
})
