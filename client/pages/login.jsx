import React from 'react'

const Login = React.createClass({
  render () {
    return (
      <div className='panel'>
        <form>
          <fieldset className='form-group'>
            <label htmlFor='username'>Github Username</label>
            <input type='text' className='form-control' id='username' />
          </fieldset>
          <fieldset className='form-group'>
            <label htmlFor='password'>Github Password</label>
            <input type='password' className='form-control' id='password' />
          </fieldset>
          <button type='submit' className='btn btn-primary'>Login</button>
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
