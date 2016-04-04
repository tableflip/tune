import { putPageContent, getPages } from '../imports/github-methods'
import * as validator from '/lib/imports/validator'
import * as objectPath from 'object-path'

var putPageContentAsync = Meteor.wrapAsync(putPageContent)
var getPagesAsync = Meteor.wrapAsync(getPages)

Meteor.methods({
  'pages/updateContent': function ({ pageId, fieldPath, newValue }) {
    if (!this.userId) throw new Meteor.Error('Only a logged in user can update project facts')
    check(pageId, String)
    check(fieldPath, String)
    var page = Pages.findOne(pageId)
    if (!page) throw new Meteor.Error('Cannot find page')
    var project = Projects.findOne(page.project._id)
    if (!project) throw new Meteor.Error('Cannot find associated project')
    if (project.users.indexOf(this.userId) < 0) {
      throw new Meteor.Error('A user can only update a project of which they are a member')
    }
    if (objectPath.get(page.content.json, `${fieldPath}.value`) === undefined) {
      throw new Meteor.Error('You cannot add a key to page content')
    }
    var validation = validator.validateDocField({
      doc: page,
      fieldPath: fieldPath,
      newValue: newValue
    })
    if (validation.error) throw new Meteor.Error(validation.error)
    var update = { [`content.json.${fieldPath}.value`]: newValue }
    Pages.update(page._id, { $set: update })
    var response = putPageContentAsync(this.userId, project.full_name, page.name, page.isRoot)
    var githubProjectUpdate = {
      'lastCommit.sha': response.data.commit.sha,
      'lastCommit.dateTime': response.data.commit.committer.date
    }
    var pageDir = getPagesAsync(this.userId, project.full_name).filter(item => item.name === page.name)
    var githubPageUpdate = {
      'content.sha': response.data.content.sha,
      'directory.sha': pageDir.sha
    }
    Projects.update(project._id, { $set: githubProjectUpdate })
    return Pages.update(page._id, { $set: githubPageUpdate })
  }
})
