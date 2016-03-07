import React from 'react'

export const LoginWithGithub = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData () {
    var user = Meteor.user()
    return {
      user: Meteor.user()
    }
  },
  login () {
    Meteor.loginWithGithub({ requestPermissions: ['repo'] })
  },
  logout () {
    Meteor.logout()
  },
  render () {
    if (this.data.user) {
      return (
        <div>
          <div>Logged in as {this.data.user.profile.name}</div>
          <button className="btn btn-secondary" type="button" onClick={this.logout}>Log out</button>
        </div>
      )
    }
    return (
      <div>
        <button className="btn btn-primary" type="button" onClick={this.login}>Log in with Github</button>
      </div>
    )
  }
})
