import React from 'react'
import Loader from 'react-loader'
import Breadcrumbs from '../components/breadcrumbs'
import FieldPreview from '../components/field-preview'

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
    if (!this.data.projectReady) return (<Loader loaded={false} />)
    let facts = Object.keys(this.data.project.facts.json)
    return (
      <div>
        <Breadcrumbs pages={[
          { text: 'home', href: '/' },
          { text: this.data.project.full_name, href: `/project/${this.data.project._id}` },
          { text: 'Website settings', active: true }
        ]} />
        <div className="container">
          <h3 className="m-t-1 m-b-2">{this.data.project.name}</h3>
          <ul className='list-group'>
            {facts.map((fact, ind) => {
              let schema = this.data.project.schema[fact]
              let type = schema && schema.type
              let value = this.data.project.facts.json[fact]
              return (
                <a className='list-group-item' key={ind} href={`/project/${this.props.projectId}/facts?field=${fact}`}>
                  <h5 className="list-group-item-heading">{fact}</h5>
                  <div className="list-group-item-text"><em>
                    <FieldPreview type={type} value={value} />
                  </em></div>
                </a>
              )}
            )}
          </ul>
        </div>
      </div>
    )
  }
})
