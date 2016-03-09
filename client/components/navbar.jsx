import React from 'react'
import { Icon } from './icon'

export const Navbar = React.createClass({
  componentDidMount () {

  },
  componentWillUnmount () {

  },
  render () {
    return (
      <div>
        <div className="navbar navbar-full navbar-dark bg-inverse">
          <a className="pull-xs-right" href="/">
            <Icon beep="logo-table" />
          </a>
        </div>
      </div>
    )
  }
})
