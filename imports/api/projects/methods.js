import { Meteor } from 'meteor/meteor'
import { tagGhPages } from '../github/methods'
import { syncAll } from '/imports/lib/github/github-sync'
import Projects from './projects'

var syncAllAsync = Meteor.wrapAsync(syncAll)
var tagGhPagesSync = Meteor.wrapAsync(tagGhPages)

Meteor.methods({
  'projects/sync': function () {
    if (!this.userId) throw new Meteor.Error('Only a logged in user can sync projects')
    return syncAllAsync(this.userId)
  },

  'projects/tag': function (projectId) {
    if (!this.userId) throw new Meteor.Error('Only a logged in user can tag a project')

    let project = Projects.findOne(projectId)
    if (!project) throw new Meteor.Error('Cannot find project')

    if (project.users.indexOf(this.userId) < 0) {
      throw new Meteor.Error('A user can only tag a project of which they are a member')
    }

    return tagGhPagesSync(this.userId, project.full_name)
  }
})
