import * as githubMethods from '../imports/github-methods'
import * as githubSync from '../imports/github-sync'

Meteor.methods({
  'github/getRepos' () {
    if (!this.userId) throw new Meteor.Error('Only a logged in user can retrieve their projects')
    return githubMethods.getRepos(this.userId)
      .map(({ name, full_name, created_at, updated_at }) => ({ name, full_name, created_at, updated_at }))
  },

  'github/getPages' (fullPath) {
    if (!this.userId) throw new Meteor.Error('Only a logged in user can retrieve their projects')
    return new Promise((resolve, reject) => {
      githubMethods.getPages(this.userId, fullPath, (err, res) => {
        if (err) return reject(err)
        resolve(res)
      })
    }).catch(err => {
      console.error(err)
      throw new Meteor.Error(err.message || 'Could not get pages')
    })
  },

  'github/putPages' (fullPath, json, commitMsg) {
    if (!this.userId) throw new Meteor.Error('Only a logged in user can retrieve their projects')
    return new Promise((resolve, reject) => {
      githubMethods.putPages(this.userId, fullPath, { json: json, commitMsg: commitMsg }, (err, res) => {
        if (err) return reject(err)
        resolve(res)
      })
    }).catch(err => {
      console.error(err)
      throw new Meteor.Error(err.message || 'Could not get pages')
    })
  }
})
