import React from 'react'
import fields from '../lib/field-lookup'

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
    return null
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
    Meteor.call('projects/updateFact', payload, (err) => {
      if (err) return console.error('Error calling "projects/updateFact"', err)
      FlowRouter.go('project', { projectId: this.props.projectId })
    })
  },
  render () {
    if (!this.data.projectReady) return (<div>Fetching facts...</div>)
    var props = {
      project: this.data.project,
      field: this.props.field,
      update: this.update,
      save: this.save
    }
    return (<ProjectField {...props} />)
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
      <form>
        { field }
        <button type='submit' className='btn btn-primary' onClick={this.props.save}>Save</button>
      </form>
    )
  }
})
