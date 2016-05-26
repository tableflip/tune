import { Meteor } from 'meteor/meteor'
import { _ } from 'meteor/underscore'
import async from 'async'
import githubInterface from '/imports/lib/github/github-interface'
import base64 from '/imports/lib/github/base64'
import Projects from '../projects/projects'
import Pages from '../pages/pages'

function base64ToJson (str) {
  var obj = {}
  try {
    obj = JSON.parse(base64.decode(str))
  } catch (err) {
    console.log(err)
  }
  return obj
}

function getFileContents (github, repo, dir, filename, cb) {
  var fileInfo = dir.find(obj => obj.type === 'file' && obj.name === filename)
  // file not in this dir... return nothing, in the next tick, meteor style.
  if (!fileInfo) return Meteor.setTimeout(cb, 0)
  // File exists, go get it.
  github.getFileContents(repo, fileInfo.path, (err, res) => {
    if (res && res.content) res.content = base64ToJson(res.content)
    cb(err, res)
  })
}

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
  github.getDirContents(fullName, '', (err, dir) => {
    if (err) return cb(err) // ruh roh, couldn't list dir contents.
    async.parallel({
      factsJson: (cb) => {
        getFileContents(github, fullName, dir, 'facts.json', (err, res) => {
          cb(err, { sha: res && res.sha, content: res && res.content })
        })
      },
      schemaJson: (cb) => {
        getFileContents(github, fullName, dir, 'schema.json', (err, res) => {
          cb(err, { content: res && res.content })
        })
      }
    }, (err, data) => {
      if (err) return cb(err)
      if (!data.factsJson) return cb(err, null)
      cb(null, {
        sha: data.factsJson.sha,
        content: data.factsJson.content,
        schema: data.schemaJson.content
      })
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
  github.getDirContents(fullName, `pages/${page}`, (err, dir) => {
    if (err) return cb(err) // ruh roh, couldn't list dir contents.
    async.parallel({
      contentJson: (cb) => {
        getFileContents(github, fullName, dir, 'content.json', (err, res) => {
          cb(err, { sha: res && res.sha, content: res && res.content })
        })
      },
      schemaJson: (cb) => {
        getFileContents(github, fullName, dir, 'schema.json', (err, res) => {
          cb(err, { content: res && res.content })
        })
      }
    }, (err, data) => {
      if (err) return cb(err)
      if (!data.contentJson) return cb(err, null)
      cb(null, {
        name: page,
        sha: data.contentJson.sha,
        dateTime: new Date(),
        content: data.contentJson.content,
        schema: data.schemaJson.content
      })
    })
  })
}

export function putPageContent (userId, fullName, pageName, isRoot, cb) {
  var github = githubInterface(userId)
  var project = Projects.findOne({ full_name: fullName })
  if (!project) return cb('Cannot find project')
  var page = Pages.findOne({ 'project._id': project._id, name: pageName })
  if (!page) return cb('Cannot find page')
  var filename = isRoot ? 'facts.json' : `pages/${pageName}/content.json`
  github.putFileContents(project.full_name, filename, {
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
