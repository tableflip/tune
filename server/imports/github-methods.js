import async from 'async'
import githubInterface from './github-interface'
import isTuneProject from './is-tune-project'
import base64 from './base64'

export function getRepos (userId, cb) {
  var github = githubInterface(userId)
  github.getRepos((err, res) => {
    if (err) return cb(err)
    cb(null, _.uniq(res, false, repo => repo.full_name))
  })
}

export function getLastCommit (userId, fullName, opts, cb) {
  var github = githubInterface(userId)
  return github.getLastCommit(fullName, opts, cb)
}

export function getFacts (userId, fullName, cb) {
  var github = githubInterface(userId)
  async.waterfall([
    function getRootDirContents (cb) {
      github.getDirContents(fullName, '', cb)
    },
    function getFacts (res, cb) {
      var factsJson = res.find(obj => obj.type === 'file' && obj.name === 'facts.json')
      github.getFileContents(fullName, 'facts.json', (err, res) => {
        cb(err, { sha: factsJson.sha, content: res.content })
      })
    },
    function getSchema (data, cb) {
      github.getFileContents(fullName, 'schema.json', (err, res) => {
        if (err) {
          if (err.response && err.response.statusCode === 404) {
            data.schema = '{}'
          } else {
            return cb(err)
          }
        } else {
          data.schema = res.content
        }
        cb(null, data)
      })
    }
  ], (err, data) => {
    if (err) return cb(err)
    cb(null, {
      sha: data.sha,
      content: JSON.parse(base64.decode(data.content)),
      schema: JSON.parse(base64.decode(data.schema))
    })
  })
}

export function getPages (userId, fullName, cb) {
  var github = githubInterface(userId)
  github.getDirContents(fullName, 'pages', (err, res) => {
    if (err) return cb(err)
    var pages = res.filter(obj => obj.type === 'dir')
                   .map(({ name, path, sha }) => ({ name, path, sha }))
    cb(null, pages)
  })
}

export function getAllPageContents (userId, fullName, cb) {
  var github = githubInterface(userId)
  var contents = github.getDirContents(fullName, 'pages')
  var pages = contents.filter(obj => obj.type === 'dir').map(obj => obj.name)
  async.map(pages, (page, cb) => {
    getPageContents(fullName, page, cb)
  }, cb)
}

export function getPageContents (userId, fullName, page, cb) {
  var github = githubInterface(userId)
  async.waterfall([
    function getPageDirContents (cb) {
      github.getDirContents(fullName, `pages/${page}`, cb)
    },
    function getPageDataJson (res, cb) {
      var contentJson = res.find(obj => obj.type === 'file' && obj.name === 'content.json')
      if (!contentJson) return cb('Missing content.json')
      github.getFileContents(fullName, `pages/${page}/${contentJson.name}`, (err, res) => {
        cb(err, { sha: contentJson.sha, content: res.content })
      })
    },
    function getPageSchemaJson (data, cb) {
      github.getFileContents(fullName, `pages/${page}/schema.json`, (err, res) => {
        if (err) {
          if (err.response && err.response.statusCode === 404) {
            data.schema = '{}'
          } else {
            return cb(err)
          }
        } else {
          data.schema = res.content
        }
        cb(null, data)
      })
    }
  ], (err, data) => {
    if (err) return cb(err)
    cb(null, {
      name: page,
      sha: data.sha,
      dateTime: new Date(),
      content: JSON.parse(base64.decode(data.content)),
      schema: JSON.parse(base64.decode(data.schema))
    })
  })
}

export function putFacts (userId, fullName, cb) {
  var github = githubInterface(userId)
  var project = Projects.findOne({ full_name: fullName })
  if (!project) return cb('Cannot find project')
  github.putFileContents(project.full_name, 'facts.json', {
    commitMsg: `facts.json updated via ${Meteor.settings.appName}`,
    json: project.facts.json,
    sha: project.facts.sha
  }, cb)
}

export function putPageContent (userId, fullName, pageName, cb) {
  var github = githubInterface(userId)
  var project = Projects.findOne({ full_name: fullName })
  if (!project) return cb('Cannot find project')
  var page = Pages.findOne({ 'project._id': project._id, name: pageName })
  if (!page) return cb('Cannot find page')
  github.putFileContents(project.full_name, `pages/${pageName}/content.json`, {
    commitMsg: `${pageName} updated via ${Meteor.settings.appName}`,
    json: page.content.json,
    sha: page.content.sha
  }, cb)

}

export function tagGhPages (userId, fullName, cb) {
  let github = githubInterface(userId)

  async.waterfall([
    // Get current project version
    Meteor.bindEnvironment(function (cb) {
      github.getFileContents(fullName, 'package.json', cb)
    }),
    // Increment version
    Meteor.bindEnvironment(function (res, cb) {
      let pkg = JSON.parse(base64.decode(res.content))
      pkg.version = incrementPatch(pkg.version)
      cb(null, pkg, res.sha)
    }),
    // Get commit sha to tag
    Meteor.bindEnvironment(function (pkg, pkgSha, cb) {
      github.getLastCommit(fullName, {sha: 'gh-pages'}, (err, commits) => {
        if (err) return cb(err)
        if (!commits || !commits.length) return cb(new Error('No commits to tag'))
        cb(null, pkg, pkgSha, commits[0])
      })
    }),
    // Update package.json
    Meteor.bindEnvironment(function (pkg, pkgSha, commit, cb) {
      let params = {commitMsg: pkg.version, sha: pkgSha, json: pkg}
      github.putFileContents(fullName, 'package.json', params, (err) => cb(err, pkg, commit))
    }),
    // Create tag
    Meteor.bindEnvironment(function (pkg, commit, cb) {
      github.postRef(fullName, `refs/tags/v${pkg.version}`, commit.sha, cb)
    })
  ], cb)
}

function incrementPatch (version) {
  let numbers = /^([0-9]+)\.([0-9]+)\.([0-9]+)/.exec(version)
  return `${numbers[1]}.${numbers[2]}.${parseInt(numbers[3], 10) + 1}`
}
