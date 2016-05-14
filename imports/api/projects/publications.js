import { Meteor } from 'meteor/meteor'
import Pages from '../pages/pages'
import Projects from './projects'

Meteor.publish('projects', function () {
  return Projects.find({ users: this.userId })
})

Meteor.publish('project', function (projectId) {
  var project = Projects.findOne({ users: this.userId, _id: projectId })
  if (!project) return this.ready()
  return [
    Projects.find({ _id: project._id }),
    Pages.find({ 'project._id': project._id })
  ]
})
