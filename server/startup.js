Meteor.startup(() => {
  ServiceConfiguration.configurations.upsert({
    service: 'github'
  }, {
    $set: {
      clientId: Meteor.settings.github.clientId,
      secret: Meteor.settings.github.secret
    }
  })
})

// DELETE ME
import * as Github from './imports/github-methods'

GithubGlobal = Github
