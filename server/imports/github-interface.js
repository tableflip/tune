import parseGithubHeaders from 'parse-link-header'
import async from 'async'
import isPlatformProject from './is-platform-project'
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
  function makeRepoRequest (url, cb) {
    githubCall({
      method: 'GET',
      url: url,
      opts: {}
    }, cb)
  }
  var github = {
    getRepos: function (cb) {
      if (!cb) throw new Error('Please supply a callback function')
      let repos = []
      let q = async.queue(Meteor.bindEnvironment(function (url, done) {
        makeRepoRequest(url, function (err, res) {
          repos = _.union(repos, res.data.filter(isPlatformProject))
          let headers = parseGithubHeaders(res.headers.link)
          if (headers.next) q.push(headers.next.url)
          done()
        })
      }), 1)
      q.push(`${baseUrl}/user/repos?per_page=100`)
      q.drain = function () {
        cb(null, repos)
      }
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

// function getRepos (cd) {
//   githubCall({
//     method: 'GET',
//     url: `${baseUrl}/user/repos`,
//     opts: {
//       params: {
//         per_page: 100
//       }
//     }
//   }, pluckFromResponse('data', cb))
// }



function base64Encode (json) {
  return new Buffer(JSON.stringify(json, null, '\t')).toString('base64')
}
