import React from 'react'

export const Navbar = React.createClass({
  componentDidMount () {

  },
  componentWillUnmount () {

  },
  render () {
    return (
      <div>
        <div className="navbar navbar-light bg-primary">
          <a className="navbar-brand" href="#">TABLEFLIP</a>
          <button className="navbar-toggler pull-xs-right" type="button" data-toggle="collapse" data-target="#navbarMenu">&#9776;</button>
          <div className="collapse navbar-toggleable-xs" id="navbarMenu">
            <ul className="nav navbar-nav">
              <li className="nav-item active">
                <a className="nav-link" href="/">Home</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
})
