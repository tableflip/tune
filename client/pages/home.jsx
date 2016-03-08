import React from 'react'
import moment from 'moment'
import { LoginWithGithub } from '../components/login-with-github'
import { ProjectCard } from '../components/project-card'

export default React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData () {
    var projectSub = Meteor.subscribe('projects')
    return {
      projectsReady: projectSub.ready(),
      projects: Projects.find({}).fetch()
    }
  },

  render () {
    return (
      <div>
        <div className="jumbotron">
          <p className="lead">TABLEFLIP Automated Build System</p>
          <LoginWithGithub />
        </div>
        <div className="container">
          <div className="row">
            {this.data.projects.map(project => (
              <div className="col-sm-6 col-md-4">
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
})
