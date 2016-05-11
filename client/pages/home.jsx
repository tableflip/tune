import React from 'react'
import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data'
import Projects from '/lib/collections-global/projects'
import Loader from '../components/loader'
import { LoginWithGithub } from '../components/login-with-github'
import { ProjectCard } from '../components/project-card'

const Home = React.createClass({
  render () {
    if (!this.data.user) {
      return (
        <div className='container-fluid bg-inverse h-100 text-xs-center'>
          <p className='h4 p-t-3'>Please log in<br />to edit your site</p>
          <LoginWithGithub />
        </div>
      )
    } else if (this.data.loggingIn) {
      return <Loader loaded={false} color='#ddd' />
    }
    return (
      <div className='container-fluid'>
        <p className='lead m-t-1'>Pick a site</p>
        <ProjectsList projects={this.data.projects} />
        <LoginWithGithub />
      </div>
    )
  }
})

let ProjectsList = React.createClass({
  render () {
    return (
      <div className='row'>
        {this.props.projects.map(project => (
          <div className='col-md-6 col-xl-4' key={project._id}>
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    )
  }
})

export default createContainer(({ props }) => {
  window.Subs.subscribe('projects')
  return {
    user: Meteor.user(),
    loggingIn: Meteor.loggingIn(),
    projects: Projects.find({}).fetch()
  }
}, Home)
