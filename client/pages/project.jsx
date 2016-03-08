import React from 'react'

export default React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData () {
    var projectSub = Meteor.subscribe('project', this.props.projectId)
    return {
      projectReady: projectSub.ready(),
      project: Projects.findOne({ _id: this.props.projectId }),
      pages: Pages.find({ 'project._id': this.props.projectId }).fetch()
    }
  },

  render () {
    if (!this.data.projectReady) return (<div>Loading...</div>)
    return (
      <div>
        <h1>{this.data.project.name}</h1>
        <ul className='list-group'>
          <li className='list-group-item'><a href={`/project/${this.props.projectId}/facts`}>Website facts</a></li>
          {this.data.pages.map(page => (<li className='list-group-item' key={page._id}><a href={`/page/${page._id}`}>{page.name}</a></li>))}
        </ul>
      </div>
    )
  }
})
