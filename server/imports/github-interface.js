var baseUrl = 'https://api.github.com'

export default function (userId) {
  var user = Meteor.users.findOne(userId)
  if (!user) throw new Meteor.Error('You must supply a valid userId')
  if (!user.services || !user.services.github || !user.services.github.accessToken) throw new Meteor.Error('User has no Github auth credentials')
  var token = user.services.github.accessToken

  function githubCall ({ method, url, opts }, cb) {
    opts = opts || {}
    opts.headers = opts.headers || {}
    opts.headers.Authorization = `token ${token}`
    opts.headers.Accept = opts.headers.Accept || 'application/vnd.github.v3+json'
    opts.headers['User-Agent'] = Meteor.settings.appName
    console.log(opts)
    if (cb) return HTTP.call(method, url, opts, cb)
    return HTTP.call(method, url, opts)
  }

  var github = {
    getRepos: function (cb) {
      var cb = cb ? makeReturnData('data', cb) : null
      var res = githubCall({
        method: 'GET',
        url: `${baseUrl}/user/repos`,
        opts: {
          params: {
            per_page: 100
          }
        }
      }, cb)
      if (!cb) return res.data
    },

    getDirContents: function (fullName, path, cb) {
      var cb = cb ? makeReturnData('data', cb) : null
      var res = githubCall({
        method: 'GET',
        url: `${baseUrl}/repos/${fullName}/contents/${path}`
      }, cb)
      if (!cb) return res.data
    },

    getFileContents: function (fullName, path, cb) {
      var cb = cb ? makeReturnData('content', cb) : null
      var res = githubCall({
        method: 'GET',
        url: `${baseUrl}/repos/${fullName}/contents/${path}`,
        opts: {
          headers: {
            Accept: 'application/vnd.github.v3.raw'
          }
        }
      }, cb)
      if (!cb) return res.data
    }
  }

  return github
}

function makeReturnData (key, cb) {
  return (err, res) => {
    if (res) return cb(err, res[key])
    cb(err)
  }
}
