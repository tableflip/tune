import React from 'react'
import Loader from 'react-loader'

export const LoginWithGithub = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData () {
    var user = Meteor.user()
    return {
      user: Meteor.user(),
      loggingIn: Meteor.loggingIn()
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
          <p>Logged in as {this.data.user.profile.name}</p>
          <button className="btn btn-primary-outline" type="button" onClick={this.logout}>Log out</button>
        </div>
      )
    } else if (this.data.loggingIn) {
      return (<Loader loaded={false}/>)
    } else {
      return (
        <div>
          <p>&nbsp;</p>
          <button className="btn btn-primary" type="button" onClick={this.login}>Log in with Github</button>
        </div>
      )
    }
  }
})
