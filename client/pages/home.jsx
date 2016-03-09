import React from 'react'
import moment from 'moment'
import Loader from '../components/loader'
import { LoginWithGithub } from '../components/login-with-github'
import { ProjectCard } from '../components/project-card'

export default React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData () {
    var projectSub = Meteor.subscribe('projects')
    return {
      user: Meteor.user(),
      loggingIn: Meteor.loggingIn(),
      projectsReady: projectSub.ready(),
      projects: Projects.find({}).fetch()
    }
  },

  render () {
    if (!this.data.user) {
      return (
        <div className="container-fluid bg-inverse h-100 text-xs-center">
          <p className="h4 p-t-3">Please log in<br/>to edit your site</p>
          <LoginWithGithub />
        </div>
      )
    }
    return (
      <div className="container-fluid">
        <p className="lead m-t-1">Pick a site</p>
        {this.data.projectsReady ? <ProjectsList projects={this.data.projects} /> : <Loader loaded={false} />}
        <LoginWithGithub />
      </div>
    )
  }
})

let ProjectsList = React.createClass({
  render() {
    return (
      <div className="row">
        {this.props.projects.map(project => (
          <div className="col-md-6 col-xl-4" key={project._id}>
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    )
  }
})
