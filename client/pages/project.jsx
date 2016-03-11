import React from 'react'
import Loader from '../components/loader'
import Breadcrumbs from '../components/breadcrumbs'

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
          { text: 'Home', href: '/' },
          { text: 'Site', active:true }
        ]} />
        <div className="container">
          <p className="lead m-t-1">Pick a page</p>
          <div className='list-group'>
            <a className='list-group-item' href={`/project/${this.props.projectId}/facts`}>Website settings</a>
            {this.data.pages.map(page => (<a className='list-group-item' key={page._id} href={`/project/${this.data.project._id}/page/${page._id}`}>Page - {page.name}</a>))}
          </div>
        </div>
      </div>
    )
  }
})
