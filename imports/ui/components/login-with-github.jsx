import React from 'react'
import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data'
import { login, logout} from '../redux/actions'

const LoginWithGithub = React.createClass({
  login () {

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

const mapDispatchToProps = (dispatch) => {
  return {
    onLoginClick: () => {
      dispatch(toggleTodo(id))
    }
  }
}

export default createContainer(() => {
  return {
    user: Meteor.user()
  }
}, LoginWithGithub)
