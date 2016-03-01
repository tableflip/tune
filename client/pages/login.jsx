import React from 'react'

const Login = React.createClass({
  auth: function (e) {
    e.preventDefault()
    let username = this.refs.username.value
    let password = this.refs.password.value
  },
  render () {
    return (
      <div className='panel'>
        <div className='text-center'>
          <img src='/tableflip-logo.svg' width='230px'/>
        </div>
        <form>
          <fieldset className='form-group'>
            <label htmlFor='username'>Github Username</label>
            <input type='text' className='form-control' id='username' ref='username'/>
          </fieldset>
          <fieldset className='form-group'>
            <label htmlFor='password'>Github Password</label>
            <input type='password' className='form-control' id='password' ref='password'/>
          </fieldset>
          <button type='submit' className='btn btn-primary' onClick={ this.auth }>Login</button>
        </form>
      </div>
    )
  }
})

export default () => {
  return (
    <Login />
  )
}
