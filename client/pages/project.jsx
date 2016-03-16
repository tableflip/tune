import React from 'react'
import { connect } from 'react-redux'
import Breadcrumbs from '../components/breadcrumbs'

const Project = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData () {
    var projectSub = Subs.subscribe('project', this.props.projectId)
    return {
      project: Projects.findOne({ _id: this.props.projectId }),
      pages: Pages.find({ 'project._id': this.props.projectId }).fetch()
    }
  },

  render () {
    if (this.props.spinnerVisible) return false
    return (
      <div>
        <Breadcrumbs pages={[
          { text: 'Home', href: '/' },
          { text: this.data.project.name, active:true }
        ]} />
        <div className="container">
          <h3 className="m-y-1 text-muted">{this.data.project.name}</h3>
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

export default connect(state => state)(Project)
