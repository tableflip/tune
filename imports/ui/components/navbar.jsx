import React from 'react'
import { connect } from 'react-redux'
import { createContainer } from 'meteor/react-meteor-data'
import { Link } from 'react-router'
import store from '../redux/store'
import { Icon } from './icon'

const Navbar = React.createClass({
  render () {
    const path = this.props.project && `/project/${this.props.project._id}`
    return (
      <div>
        <div className="navbar navbar-full navbar-dark bg-inverse">
          <ul className="nav navbar-nav">
            {this.props.project && (
              <li className="nav-item active pull-xs-left">
                <Link className="nav-link" to={path}>{this.props.project.name}</Link>
              </li>
            )}
            <li className="nav-item pull-xs-right">
              <Link to="/">
                <Icon beep="logo-table" />
              </Link>
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
