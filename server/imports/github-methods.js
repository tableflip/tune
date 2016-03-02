import async from 'async'
import githubInterface from './github-interface'

export function getRepos (userId) {
  var github = githubInterface(userId)
  return github.getRepos().filter(isPlatformProject)
}

export function getLastCommit (userId, fullName, cb) {
  var github = githubInterface(userId)
  return github.getLastCommit(fullName, cb)
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
        cb(err, { sha: factsJson.sha, content: res })
      })
    }
  ], (err, data) => {
    if (err) return cb(err)
    cb(null, {
      sha: data.sha,
      content: JSON.parse(data.content)
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
        cb(err, { sha: contentJson.sha, content: res })
      })
    }
  ], (err, data) => {
    if (err) return cb(err)
    cb(null, {
      name: page,
      sha: data.sha,
      dateTime: new Date(),
      content: JSON.parse(data.content)
    })
  })
}

export function putPages (userId, fullName, { json, commitMsg }, cb) {
  var github = githubInterface(userId)
  async.map(json, (pageDetails, cb) => {
    var pageObj = {
      commitMsg: commitMsg,
      json: pageDetails.content,
      sha: pageDetails.sha
    }
    putPageContents(github, fullName, pageDetails.name, pageObj, cb)
  }, cb)
}

export function putPageContents (userId, fullName, page, { commitMsg, json, sha }, cb) {
  var github = githubInterface(userId)
  var pagePath = `pages/${page}/contents.json`
  return github.putFileContents(fullName, pagePath, { commitMsg, json, sha }, cb)
}

function isPlatformProject (repo) {
  return repo.description && repo.description.indexOf('[THE_PLATFORM]') > -1
}
