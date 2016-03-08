import React from 'react'
import moment from 'moment'
import Loader from 'react-loader'
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
          {this.data.projectsReady ? <ProjectsList projects={this.data.projects} /> : <Loader loaded={false} />}
        </div>
      </div>
    )
  }
})

let ProjectsList = React.createClass({
  render() {
    return (
      <div className="row">
        {this.props.projects.map(project => (
          <div className="col-sm-6 col-md-4" key={project._id}>
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    )
  }
})
