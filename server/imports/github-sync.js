import async from 'async'
import * as githubMethods from './github-methods'
import { mergeSchema } from './content-schema-transform'

var getReposSync = Meteor.wrapAsync(githubMethods.getRepos)

export function syncAll (userId, cb) {
  var projects = getReposSync(userId)
  async.mapLimit(projects, 3, (project, cb) => {
    syncProject(userId, { fullName: project.full_name, name: project.name }, cb)
  }, (err, res) => {
    if (err) return cb(err)
    cb(null, res.reduce((memo, obj) => {
      memo.numberAffected += obj.numberAffected
      return memo
    }, { numberAffected: 0 }))
  })
}

export function syncProject (userId, { fullName, name }, cb) {
  async.parallel({
    lastCommit: cb => {
      githubMethods.getLastCommit(userId, fullName, cb)
    },
    facts: cb => {
      githubMethods.getFacts(userId, fullName, cb)
    }
  }, (err, res) => {
    if (err) return cb(err)
    if (Projects.find({ full_name: fullName, 'lastCommit.sha': res.lastCommit[0].sha }).count()) {
      console.log(`Not syncing ${fullName} as we already have the most recent commit`)
      return cb(null, { numberAffected: 0 })
    }
    var project = {
      full_name: fullName,
      name: name,
      lastCommit: {
        sha: res.lastCommit[0].sha,
        dateTime: res.lastCommit[0].commit.committer.date
      }
    }
    Projects.upsert({ full_name: fullName }, { $set: project, $addToSet: { users: userId } }, {}, e => {
      if (e) {
        console.error(`Cannot sync project "${project.full_name}"`, e)
        return cb(e)
      }
      var projectId = Projects.findOne({ full_name: fullName })._id
      var page = {
        name: Pages.rootName,
        project: {
          full_name: project.full_name,
          _id: projectId
        },
        isRoot: true,
        content: {
          json: mergeSchema(res.facts.content, res.facts.schema),
          sha: res.facts.sha
        },
        directory: {
          sha: null
        }
      }
      Pages.upsert({ name: Pages.rootName, 'project.full_name': project.full_name }, { $set: page }, {}, e => {
        if (e) {
          console.error(`Cannot sync page "Site Settings" in project "${project.full_name}"`, e)
          return cb(e)
        }
        syncPages(userId, fullName, cb)
      })
    })
  })
}

export function syncPages (userId, fullName, done) {
  var project = Projects.findOne({ full_name: fullName })
  if (!project) return done('Cannot find matching project')
  async.waterfall([
    function getPageMetadata (cb) {
      githubMethods.getPages(userId, fullName, cb)
    },
    function filterPages (pages, cb) {
      var filteredPages = pages.filter(page => {
        return !Pages.find({
          'project.full_name': fullName,
          'name': page.name,
          'directory.sha': page.sha
        }).count()
      })
      cb(null, filteredPages)
    },
    // At some point I will work out why everything works without binding environment apart from this step
    Meteor.bindEnvironment(function getUpdatedPageContents (pages, cb) {
      async.map(pages, (page, cb) => {
        githubMethods.getPageContents(userId, fullName, page.name, (err, res) => {
          if (err) return cb(err)
          res.commitSha = page.sha
          cb(null, res)
        })
      }, cb)
    }, done),
    function updatePages (pagesDetails, cb) {
      async.each(pagesDetails, (pageDetails, done) => {
        var page = {
          name: pageDetails.name,
          project: {
            _id: project._id,
            full_name: project.full_name
          },
          isRoot: false,
          directory: {
            sha: pageDetails.commitSha
          },
          content: {
            sha: pageDetails.sha,
            json: mergeSchema(pageDetails.content, pageDetails.schema)
          }
        }
        Pages.upsert({ name: pageDetails.name, 'project.full_name': project.full_name }, { $set: page }, {}, e => {
          if (e) {
            console.error(`Cannot sync page "${page}" in project "${project.full_name}"`, e)
            return done(e)
          }
          done()
        })
      }, err => {
        cb(err, { numberAffected: pagesDetails.length })
      })
    }
  ], (err, res) => {
    done(err, res)
  })
}
