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
    if (cb) return HTTP.call(method, url, opts, cb)
    return HTTP.call(method, url, opts)
  }

  var github = {
    getRepos: function (cb) {
      var res = githubCall({
        method: 'GET',
        url: `${baseUrl}/user/repos`,
        opts: {
          params: {
            per_page: 100
          }
        }
      }, pluckFromResponse('data', cb))
      if (!cb) return res.data
    },

    getLastCommit: function (fullName, cb) {
      var res = githubCall({
        method: 'GET',
        url: `${baseUrl}/repos/${fullName}/commits`,
        opts: {
          params: {
            per_page: 1
          }
        }
      }, pluckFromResponse('data', cb))
      if (!cb) return res.data
    },

    getDirContents: function (fullName, path, cb) {
      var res = githubCall({
        method: 'GET',
        url: `${baseUrl}/repos/${fullName}/contents/${path}`
      }, pluckFromResponse('data', cb))
      if (!cb) return res.data
    },

    getFileContents: function (fullName, path, cb) {
      var res = githubCall({
        method: 'GET',
        url: `${baseUrl}/repos/${fullName}/contents/${path}`,
        opts: {
          headers: {
            Accept: 'application/vnd.github.v3.raw'
          }
        }
      }, pluckFromResponse('content', cb))
      if (!cb) return res.content
    },

    putFileContents: function (fullName, path, { commitMsg, json, sha }, cb) {
      var opts = {
        data: {
          message: commitMsg,
          content: base64Encode(json),
          sha: sha
        }
      }
      var res = githubCall({
        method: 'PUT',
        url: `${baseUrl}/repos/${fullName}/contents/${path}`,
        opts: opts
      }, cb)
      if (!cb) return res
    }
  }

  return github
}

function pluckFromResponse (key, cb) {
  if (!cb) return null
  return (err, res) => {
    if (res) return cb(err, res[key])
    cb(err)
  }
}

function base64Encode (json) {
  return new Buffer(JSON.stringify(json, null, '\t')).toString('base64')
}
