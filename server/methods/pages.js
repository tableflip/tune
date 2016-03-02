import { putPageContent } from '../imports/github-methods'

var putPageContentAsync = Meteor.wrapAsync(putPageContent)

Meteor.methods({
  'pages/updateContent': function ({ pageId, key, newValue }) {
    if (!this.userId) throw new Meteor.Error('Only a logged in user can update project facts')
    check(pageId, String)
    check(key, String)
    var page = Pages.findOne(pageId)
    if (!page) throw new Meteor.Error('Cannot find page')
    var project = Projects.findOne(page.project._id)
    if (!project) throw new Meteor.Error('Cannot find associated project')
    if (project.users.indexOf(this.userId) < 0) {
      throw new Meteor.Error('A user can only update a project of which they are a member')
    }
    if (!page.content.hasOwnProperty(key)) throw new Meteor.Error('You cannot add a key to page content')
    var update = {}
    update[`content.${key}`] = newValue
    Pages.update(page._id, { $set: update })
    return putPageContentAsync(this.userId, project.full_name, page.name)
  }
})
