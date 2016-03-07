import React from 'react'
import fields from '../lib/field-lookup'

export default React.createClass({
  propTypes: {
    projectId: React.PropTypes.string,
    fact: React.PropTypes.string || null
  },
  mixins: [ReactMeteorData],
  getMeteorData () {
    var projectSub = Meteor.subscribe('project', this.props.projectId, () => {
      if (!this.props.fact) return
      let type
      let project = Projects.findOne(this.props.projectId)
      if (project.schema[this.props.fact] && project.schema[this.props.fact].type)
        type = project.schema[this.props.fact].type
      else
        type = 'text'
      this.setState({type: type, content: project.facts.json[this.props.fact]})
    })
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
      key: this.props.fact,
      newValue: this.state.payload
    }
    Meteor.call('projects/updateFact', payload, (err) => {
      if (err) return console.error('Error calling "projects/updateFact"', err)
      FlowRouter.go(`/project/${this.props.projectId}/facts`)
    })
  },
  render () {
    if (!this.data.projectReady) return (<div>Fetching your project...</div>)
    let facts = this.data.project.facts.json
    let keys = _.keys(facts)
    if (!this.props.fact) {
      return (
        <div>
          <h1>{this.data.project.name}</h1>
          <ul className='list-group'>
            {
              keys.map((key) => {
                return <li className='list-group-item' key={ key }>
                  <a href={`/project/${this.props.projectId}/facts/edit/${key}`}>{ key }</a><br />
                  <small><i>{ facts[key] }</i></small>
                </li>
              })
            }
          </ul>
          <a href={ `/project/${this.props.projectId}` }>back</a>
        </div>
      )
    } else {
      if (!this.state || !this.state.content || !this.state.type) return (<div>Loading ...</div>)
      return (<form>
        { fields(this.state.type, this.state.content, this.update) }
        <button type='submit' className='btn btn-primary' onClick={ this.save }>Save</button>
      </form>)
    }
  }
})
