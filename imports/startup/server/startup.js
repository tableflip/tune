import { Meteor } from 'meteor/meteor'
import { ServiceConfiguration } from 'meteor/service-configuration'
import './accounts'

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
