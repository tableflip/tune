Meteor.startup(() => {
  if (!Items.find().count()) {
    Items.insert({ text: 'foobar' })
    Items.insert({ text: 'hello' })
    Items.insert({ text: 'can you see me?' })
  }

  ServiceConfiguration.configurations.upsert({
    service: 'github'
  }, {
    $set: {
      clientId: Meteor.settings.github.clientId,
      secret: Meteor.settings.github.secret
    }
  })
})
