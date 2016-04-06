import React from 'react'
import { connect } from 'react-redux'
import { createContainer } from 'meteor/react-meteor-data'
import store from '../redux/store'
import { Icon } from './icon'

const Navbar = React.createClass({
  render () {
    return (
      <div>
        <div className="navbar navbar-full navbar-dark bg-inverse">
          <ul className="nav navbar-nav">
            {this.props.project && (
              <li className="nav-item active pull-xs-left">
                <a className="nav-link" href="#">{this.props.project.name}</a>
              </li>
            )}
            <li className="nav-item pull-xs-right">
              <a href="/">
                <Icon beep="logo-table" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    )
  }
})

const NavbarContainer = createContainer(props => {
  Subs.subscribe('projects')
  return { project: Projects.findOne(props.projectId) }
}, Navbar)

const NavbarParent = connect(state => ({ projectId: state.routeParams.projectId }))(React.createClass({
  render () {
    return (<NavbarContainer {...this.props} />)
  }
}))

export default NavbarParent
