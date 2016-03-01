import githubInterface from '../imports/github-interface'

Meteor.methods({
  'github/getRepos' () {
    if (!this.userId) throw new Meteor.Error('Only a logged in user can retrieve their projects')
    var github = githubInterface(this.userId)
    console.log(github)
  }
})
