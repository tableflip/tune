import parseGithubHeaders from 'parse-link-header'
import async from 'async'
import { Meteor } from 'meteor/meteor'
import { HTTP } from 'meteor/http'
import isTuneProject from './is-tune-project'
import base64 from './base64'

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
          if (err) return done(err)
          repos = _.union(repos, res.data.filter(isTuneProject))
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

    getLastCommit: function (fullName, opts, cb) {
      if (!cb) {
        cb = opts
        opts = cb
      }

      opts = opts || {}

      let params = {per_page: 1}

      // Commit or branch to get last commits from
      // Default: the repository’s default branch (usually master)
      if (opts.sha) params.sha = opts.sha

      let res = githubCall({
        method: 'GET',
        url: `${baseUrl}/repos/${fullName}/commits`,
        opts: {params}
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
        url: `${baseUrl}/repos/${fullName}/contents/${path}`
      }, pluckFromResponse('data', cb))
      if (!cb) return res.data
    },

    putFileContents: function (fullName, path, { commitMsg, json, sha }, cb) {
      var opts = {
        data: {
          message: commitMsg,
          content: base64.encode(json),
          sha: sha
        }
      }
      var res = githubCall({
        method: 'PUT',
        url: `${baseUrl}/repos/${fullName}/contents/${path}`,
        opts: opts
      }, cb)
      if (!cb) return res
    },

    postRef: function (fullName, ref, sha, cb) {
      let data = {ref, sha}

      let res = githubCall({
        method: 'POST',
        url: `${baseUrl}/repos/${fullName}/git/refs`,
        opts: {data}
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
