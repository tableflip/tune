import React from 'react'
import { connect } from 'react-redux'
import Breadcrumbs from '../components/breadcrumbs'
import OverlayLoader from '../components/overlay-loader'

const Project = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData () {
    var projectSub = Subs.subscribe('project', this.props.projectId)
    return {
      project: Projects.findOne({ _id: this.props.projectId }),
      pages: Pages.find({ 'project._id': this.props.projectId }).fetch()
    }
  },

  getInitialState () {
    return { publishing: false }
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
          <div className='list-group m-y-1'>
            {this.data.pages.map(page => (<a className='list-group-item' key={page._id} href={`/project/${this.data.project._id}/page/${page._id}`}>{page.name}</a>))}
          </div>
          <button type="button" className="btn btn-danger-outline btn-block" onClick={this.onPublishClick}>Publish</button>
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

export default connect(state => state)(Project)
