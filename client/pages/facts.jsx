import React from 'react'
import { connect } from 'react-redux'
import { createContainer } from 'meteor/react-meteor-data'
import Projects from '/lib/collections-global/projects'
import Breadcrumbs from '../components/breadcrumbs'
import FieldPreview from '../components/field-preview'

const FactsInner = React.createClass({
  propTypes: {
    projectId: React.PropTypes.string,
    field: React.PropTypes.string || null
  },
  render () {
    if (this.props.spinnerVisible) return false
    let facts = Object.keys(this.data.project.facts.json)
    return (
      <div>
        <Breadcrumbs pages={[
          { text: 'Home', href: '/' },
          { text: this.data.project.name, href: `/project/${this.data.project._id}` },
          { text: 'Settings', active: true }
        ]} />
        <div className='container'>
          <p className='lead m-t-1'>Pick a setting</p>
          <ul className='list-group'>
            {facts.map((fact, ind) => {
              let schema = this.data.project.schema[fact]
              let type = schema && schema.type
              let value = this.data.project.facts.json[fact]
              return (
                <a className='list-group-item' key={ind} href={`/project/${this.props.projectId}/facts/edit?field=${fact}`}>
                  <p><code>{fact}</code></p>
                  <div><em><FieldPreview type={type} value={value} /></em></div>
                </a>
              ) }
            )}
          </ul>
        </div>
      </div>
    )
  }
})

const Facts = createContainer(({ props }) => {
  window.Subs.subscribe('project', props.projectId)
  return {
    project: Projects.findOne({ _id: props.projectId })
  }
}, FactsInner)

export default connect(state => state)(Facts)
