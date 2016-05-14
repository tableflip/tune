import React from 'react'
import { connect } from 'react-redux'
import { createContainer } from 'meteor/react-meteor-data'
import { subscribe } from '/imports/ui/redux/actions'

const Children = React.createClass({
  render () {
    return (<div>{this.props.children}</div>)
  }
})

const ProjectsSubscriber = createContainer((props) => {
  props.subscribe('projects')
  return {}
}, Children)

export const SubscribeProjects = connect(null, { subscribe })(ProjectsSubscriber)

const ProjectSubscriber = createContainer((props) => {
  props.subscribe('project', props.params.projectId)
  return {}
}, Children)

export const SubscribeProject = connect(null, { subscribe })(ProjectSubscriber)

const PageSubscriber = createContainer((props) => {
  props.subscribe('page', props.params.pageId)
  return {}
}, Children)

export const SubscribePage = connect(null, { subscribe })(PageSubscriber)
