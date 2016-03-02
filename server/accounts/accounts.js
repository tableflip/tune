import { syncAll } from '../imports/github-sync'

Accounts.onLogin(function (details) {
  syncAll(details.user._id, (err, res) => {
    if (err) {
      return console.error(`Could not sync repos for ${details.user.profile.name}`, err)
    }
    console.log(`Repos synced for ${details.user.profile.name}. Number updated: ${res.numberAffected}`)
  })
})
