import { putFacts, tagGhPages } from '../imports/github-methods'
import { syncAll } from '../imports/github-sync'
import * as validator from '/lib/imports/validator'

var putFactsAsync = Meteor.wrapAsync(putFacts)
var syncAllAsync = Meteor.wrapAsync(syncAll)
var tagGhPagesSync = Meteor.wrapAsync(tagGhPages)

Meteor.methods({
  'projects/updateFact': function ({ projectId, key, newValue }) {
    if (!this.userId) throw new Meteor.Error('Only a logged in user can update project facts')
    check(projectId, String)
    check(key, String)
    var project = Projects.findOne(projectId)
    if (!project) throw new Meteor.Error('Cannot find project')
    if (project.users.indexOf(this.userId) < 0) {
      throw new Meteor.Error('A user can only update a project of which they are a member')
    }
    if (!project.facts.json.hasOwnProperty(key)) throw new Meteor.Error('You cannot add a key to project facts')
    var validation = validator.validateDocField({
      doc: project,
      field: key,
      newValue: newValue
    })
    if (validation.error) throw new Meteor.Error(validation.error)
    var update = {}
    update[`facts.json.${key}`] = newValue
    Projects.update(projectId, { $set: update })
    var response = putFactsAsync(this.userId, project.full_name)
    var githubProjectUpdate = {
      'lastCommit.sha': response.data.commit.sha,
      'facts.sha': response.data.content.sha,
      'lastCommit.dateTime': response.data.commit.committer.date
    }
    return Projects.update(project._id, { $set: githubProjectUpdate })
  },

  'projects/sync': function () {
    if (!this.userId) throw new Meteor.Error('Only a logged in user can sync projects')
    return syncAllAsync(this.userId)
  },

  'projects/tag': function (projectId) {
    if (!this.userId) throw new Meteor.Error('Only a logged in user can tag a project')

    let project = Projects.findOne(projectId)
    if (!project) throw new Meteor.Error('Cannot find project')

    return tagGhPagesSync(this.userId, project.full_name)
  }
})
