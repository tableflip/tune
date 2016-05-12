import isEqual from 'is-equal'
import { get as getObjectPath } from 'object-path'
import { putPageContent, getPages } from '../imports/github-methods'
import * as validator from '/lib/imports/validator'

var putPageContentAsync = Meteor.wrapAsync(putPageContent)
var getPagesAsync = Meteor.wrapAsync(getPages)

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
    var currentValue = getObjectPath(page.content.json, key)
    if (currentValue === undefined) throw new Meteor.Error('You cannot add a key to page content')
    var validation = validator.validateDocField({
      doc: page,
      field: key,
      newValue: newValue
    })
    if (validation.error) throw new Meteor.Error(validation.error)
    if (isEqual(currentValue, newValue)) return 0
    var update = {}
    update[`content.json.${key}`] = newValue
    Pages.update(page._id, { $set: update })
    return savePage.call(this, page, project)
  },

  'pages/removeCollectionItem': function ({ pageId, collectionName, index }) {
    if (!this.userId) throw new Meteor.Error('Only a logged in user can update project facts')
    check(pageId, String)
    check(collectionName, String)
    check(index, Number)
    var page = Pages.findOne(pageId)
    if (!page) throw new Meteor.Error('Cannot find page')
    var project = Projects.findOne(page.project._id)
    if (!project) throw new Meteor.Error('Cannot find associated project')
    if (project.users.indexOf(this.userId) < 0) {
      throw new Meteor.Error('A user can only update a project of which they are a member')
    }
    var collection = page.content.json[collectionName]
    if (!collection) throw new Meteor.Error('Cannot find named collection')
    if (!collection[index]) throw new Meteor.Error('Collection has no entry at that index')
    collection.splice(index, 1)
    Pages.update(page._id, { $set: { [`content.json.${collectionName}`]: collection } })
    return savePage.call(this, page, project)
  }
})

function savePage (page, project) {
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
