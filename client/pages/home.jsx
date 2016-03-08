import React from 'react'
import moment from 'moment'
import { LoginWithGithub } from '../components/login-with-github'
import { Navbar } from '../components/navbar'

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
        <Navbar pagename="home" />
        <div className="jumbotron">
          <p className="lead">TABLEFLIP Automated Build System</p>
          <LoginWithGithub />
        </div>
        {this.data.projects.map(project => {
          return (<h4 key={project._id}><a href={`/project/${project._id}`}>{project.full_name} - Last commit at {moment(project.lastCommit.dateTime).format('HH:mm on ddd DD MMM YYYY')}</a></h4>)
        })}
      </div>
    )
  }
})
