import GitHubApi from 'github'

export default function (userId) {
  var user = Meteor.users.findOne(userId)
  if (!user) throw new Meteor.Error('You must supply a valid userId')
  if (!user.services || !user.services.github || !user.services.github.accessToken) throw new Meteor.Error('User has no Github auth credentials')

  var github = new GitHubApi({
      version: '3.0.0',
      protocol: 'https',
      debug: true
  })
  github.authenticate({
      type: 'oauth',
      token: user.services.github.accessToken
  })

  return github
}
