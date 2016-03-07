import React from 'react'
import fields from '../lib/field-lookup'

export default React.createClass({
  propTypes: {
    projectId: React.PropTypes.string,
    field: React.PropTypes.string || null
  },
  mixins: [ReactMeteorData],
  getMeteorData () {
    var projectSub = Meteor.subscribe('project', this.props.projectId)
    return {
      projectReady: projectSub.ready(),
      project: Projects.findOne({ _id: this.props.projectId })
    }
  },
  getInitialState: function () {
    return null
  },
  update: function (newValue) {
    this.setState({payload: newValue})
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
      FlowRouter.go(`/project/${this.props.projectId}/facts`)
    })
  },
  render () {
    if (!this.data.projectReady) return (<div>Fetching your fact...</div>)
    let type = (this.data.project.schema[this.props.field] && this.data.project.schema[this.props.field].type) || 'text'
    let content = this.data.project.facts.json[this.props.field]
    let field = fields(type, content, this.update)
    return (
      <form>
        { field }
        <button type='submit' className='btn btn-primary' onClick={ this.save }>Save</button>
      </form>
    )
  }
})
