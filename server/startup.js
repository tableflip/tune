import { Meteor } from 'meteor/meteor'

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
