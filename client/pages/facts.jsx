import React from 'react'

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
  render () {
    if (!this.data.projectReady) return (<div>Fetching your project...</div>)
    let facts = this.data.project.facts.json
    let keys = _.keys(facts)
    return (
      <div>
        <h1>{this.data.project.name}</h1>
        <ul className='list-group'>
          {
            keys.map((key) => {
              return <li className='list-group-item' key={ key }>
                <a href={`/project/${this.props.projectId}/facts/edit?field=${key}`}>{ key }</a><br />
                <small><i>{ facts[key] }</i></small>
              </li>
            })
          }
        </ul>
        <a href={ `/project/${this.props.projectId}` }>back</a>
      </div>
    )
  }
})
