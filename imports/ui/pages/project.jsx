import React from 'react'
import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import OverlayLoader from '../components/overlay-loader'
import Projects from '/imports/api/projects/projects'
import Pages from '/imports/api/pages/pages'

window.Pages = Pages

const Project = React.createClass({
  getInitialState () {
    return { publishing: false }
  },

  render () {
    if (!this.props.subsReady) return false
    return (
      <div>
        <div className='container'>
          <h3 className='m-y-1 text-muted'>{this.props.project.name}</h3>
          <p className='lead m-t-1'>Pick a page</p>
          <div className='list-group m-y-1'>
            {this.props.pages.map(page => (<Link className='list-group-item' key={page._id} to={`/project/${this.props.project._id}/page/${page._id}`}>{page.name}</Link>))}
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

const ProjectContainer = createContainer((props) => {
  const projectId = props.projectId
  return {
    project: Projects.findOne({ _id: projectId }),
    pages: Pages.find({ 'project._id': projectId }).fetch(),
    projectId: projectId
  }
}, Project)

function mapStateToProps ({ subscriptions }, ownProps) {
  return { projectId: ownProps.params.projectId, subsReady: subscriptions.ready }
}

export default connect(mapStateToProps)(ProjectContainer)
