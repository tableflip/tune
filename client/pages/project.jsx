import React from 'react'
import Loader from 'react-loader'
import { Breadcrumbs } from '../components/breadcrumbs'

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
    if (!this.data.projectReady) return (<Loader loaded={false} />)
    return (
      <div>
        <Breadcrumbs pages={[
          { text: 'home', href: '/' },
          { text: this.data.project.full_name, active:true }
        ]} />
        <div className="container">
          <h3 className="m-t-1 m-b-2">{this.data.project.full_name}</h3>
          <div className='list-group'>
            <a className='list-group-item' href={`/project/${this.props.projectId}/facts`}>Website settings</a>
            {this.data.pages.map(page => (<a className='list-group-item' key={page._id} href={`/page/${page._id}`}>Page - {page.name}</a>))}
          </div>
        </div>
      </div>
    )
  }
})
