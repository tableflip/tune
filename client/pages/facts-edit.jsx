import React from 'react'
import Loader from 'react-loader'
import OverlayLoader from '../components/overlay-loader'
import Breadcrumbs from '../components/breadcrumbs'
import fields from '../components/field-lookup'

export default React.createClass({
  mixins: [ReactMeteorData],
  propTypes: {
    projectId: React.PropTypes.string,
    field: React.PropTypes.string || null
  },
  getMeteorData () {
    var projectSub = Meteor.subscribe('project', this.props.projectId)
    return {
      projectReady: projectSub.ready(),
      project: Projects.findOne({ _id: this.props.projectId })
    }
  },
  getInitialState () {
    return { saving: false }
  },
  update (newValue) {
    this.setState({ payload: newValue })
  },
  save: function (e) {
    e.preventDefault()
    let payload = {
      projectId: this.props.projectId,
      key: this.props.field,
      newValue: this.state.payload
    }
    this.setState({ saving: true })
    Meteor.call('projects/updateFact', payload, (err) => {
      this.setState({ saving: false })
      if (err) return console.error('Error calling "projects/updateFact"', err)
      FlowRouter.go('project', { projectId: this.props.projectId })
    })
  },
  render () {
    if (!this.data.projectReady) return (<Loader loaded={false} />)
    var props = {
      project: this.data.project,
      field: this.props.field,
      update: this.update,
      save: this.save
    }
    return (<div>
      <ProjectField {...props} />
      <OverlayLoader loaded={!this.state.saving} />
    </div>)
  }
})

var ProjectField = React.createClass({
  propTypes: {
    project: React.PropTypes.object,
    field: React.PropTypes.string,
    update: React.PropTypes.func,
    save: React.PropTypes.func
  },
  getInitialState () {
    let project = this.props.project
    let field = this.props.field
    let type = (project.schema[field] && project.schema[field].type) || 'text'
    let content = project.facts.json[field]
    return { type, content }
  },
  render () {
    let field = fields(this.state.type, this.state.content, this.props.update)
    return (
      <div>
        <Breadcrumbs pages={[
          { text: 'home', href: '/' },
          { text: this.props.project.full_name, href: `/project/${this.props.project._id}` },
          { text: 'Website settings', href: `/project/${this.props.project._id}/facts` }
        ]} />
        <div className="container">
          <h3 className="m-t-1 m-b-2">{this.props.field}</h3>
          <div className="m-y-1">
            { field }
          </div>
          <div>
            <button type='submit' className='btn btn-primary' onClick={this.props.save}>Save</button>
            <a href={`/project/${this.props.project._id}`} className="btn btn-link">Cancel</a>
          </div>
        </div>
      </div>
    )
  }
})
