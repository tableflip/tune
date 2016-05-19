import React from 'react'
import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data'
import OverlayLoader from './loader/loader-overlay'

const LoginWithGithub = React.createClass({
  propTypes: {
    user: React.PropTypes.object
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
    if (this.props.user) {
      return (
        <div className='m-b-1'>
          <p>Logged in as {this.props.user.profile.name}</p>
          <button className='btn btn-primary-outline' type='button' onClick={this.logout}>Log out</button>
        </div>
      )
    } else if (this.state.loginSpinner) {
      return (<OverlayLoader position='relative' />)
    } else {
      return (
        <div>
          <p>&nbsp;</p>
          <button className='btn btn-primary btn-lg p-x-3' type='button' onClick={this.login} title='Click to login in via your Github account'>Log in</button>
        </div>
      )
    }
  }
})

export default createContainer(() => {
  return {
    user: Meteor.user()
  }
}, LoginWithGithub)
