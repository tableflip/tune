import React from 'react'
import { connect } from 'react-redux'
import { createContainer } from 'meteor/react-meteor-data'
import { Link } from 'react-router'
import Projects from '/imports/api/projects/projects'
import { subscribe } from '/imports/ui/redux/actions'
import { Icon } from './icon'

const Navbar = React.createClass({
  render () {
    const path = this.props.project && `/project/${this.props.project._id}`
    return (
      <div>
        <div className='navbar navbar-full navbar-dark bg-inverse'>
          <ul className='nav navbar-nav'>
            {this.props.project && (
              <li className='nav-item active pull-xs-left'>
                <Link className='nav-link' to={path}>{this.props.project.name}</Link>
              </li>
            )}
            <li className='nav-item pull-xs-right'>
              <Link to='/'>
                <Icon beep='logo-table' />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    )
  }
})

const NavbarContainer = createContainer((props) => {
  props.subscribe('projects')
  return { project: Projects.findOne(props.projectId) }
}, Navbar)

function mapStateToProps (state) {
  return { projectId: state.pageDetails.current.params.projectId }
}

const mapDispatchToProps = { subscribe: subscribe }

export default connect(mapStateToProps, mapDispatchToProps)(NavbarContainer)
