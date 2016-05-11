import { Meteor } from 'meteor/meteor'
import Pages from '/lib/collections-global/pages'
import Projects from '/lib/collections-global/projects'

Meteor.publish('page', function (pageId) {
  var page = Pages.findOne(pageId)
  if (!page) return this.ready()
  var project = Projects.findOne(page.project._id)
  if (!project) return this.ready()
  if (project.users.indexOf(this.userId) < 0) return this.ready()
  return [
    Projects.find({ _id: page.project._id }),
    Pages.find(pageId)
  ]
})
