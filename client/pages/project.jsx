import React from 'react'
import { connect } from 'react-redux'
import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data'
import Pages from '/lib/collections-global/pages'
import Projects from '/lib/collections-global/projects'
import Breadcrumbs from '../components/breadcrumbs'
import OverlayLoader from '../components/overlay-loader'

const ProjectInner = React.createClass({
  getInitialState () {
    return { publishing: false }
  },

  render () {
    if (this.props.spinnerVisible) return false
    return (
      <div>
        <Breadcrumbs pages={[
          { text: 'Home', href: '/' },
          { text: this.props.project.name, active: true }
        ]} />
        <div className='container'>
          <h3 className='m-y-1 text-muted'>{this.props.project.name}</h3>
          <p className='lead m-t-1'>Pick a page</p>
          <div className='list-group m-y-1'>
            <a className='list-group-item' href={`/project/${this.props.projectId}/facts`}>Website settings</a>
            {this.props.pages.map(page => (<a className='list-group-item' key={page._id} href={`/project/${this.props.project._id}/page/${page._id}`}>Page - {page.name}</a>))}
          </div>
          <button type='button' className='btn btn-danger-outline btn-block' onClick={this.onPublishClick}>Publish</button>
        </div>
        <OverlayLoader loaded={!this.state.publishing} />
      </div>
    )
  },

  onPublishClick (e) {
    e.preventDefault()

    // TODO: improve?
    if (!window.confirm('Publish changes to your LIVE website?')) return

    this.setState({ publishing: true })

    Meteor.call('projects/tag', this.props.projectId, (err) => {
      this.setState({ publishing: false })

      if (err) {
        // TODO: toastr error?
        window.alert('Failed to publish changes please try again')
        return console.error('Failed to tag', err)
      }

      // TODO: toastr success?
    })
  }
})

const Project = createContainer(({ props }) => {
  window.Subs.subscribe('project', props.projectId)
  return {
    project: Projects.findOne({ _id: this.props.projectId }),
    pages: Pages.find({ 'project._id': this.props.projectId }).fetch()
  }
}, ProjectInner)

export default connect(state => state)(Project)
