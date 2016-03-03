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
        <Navbar />
        <div className="jumbotron">
          <a className="btn btn-lnk pull-xs-right" href="/dashboard">Dashboard</a>
          <LoginWithGithub />
        </div>
        {this.data.projects.map(project => {
          return (<h4 key={project._id}>{project.full_name} - Last commit at {moment(project.lastCommit.dateTime).format('HH:mm on ddd DD MMM YYYY')}</h4>)
        })}
      </div>
    )
  }
})
