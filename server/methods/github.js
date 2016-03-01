import async from 'async'
import githubInterface from '../imports/github-interface'

Meteor.methods({
  'github/getRepos' () {
    if (!this.userId) throw new Meteor.Error('Only a logged in user can retrieve their projects')
    var github = githubInterface(this.userId)
    return github.getRepos()
            .map(({ name, full_name, created_at, updated_at }) => ({ name, full_name, created_at, updated_at }))
  },
  'github/getPages' (fullName) {
    if (!this.userId) throw new Meteor.Error('Only a logged in user can retrieve their projects')
    var github = githubInterface(this.userId)
    return new Promise((resolve, reject) => {
      getPages(github, fullName, (err, res) => {
        if (err) return reject(err)
        resolve(res)
      })
    }).catch(err => {
      console.log(err)
      throw new Meteor.Error(err.reason || err.error || 'Could not get pages')
    })
  }
})

function getPages (github, fullName, cb) {
  var contents = github.getDirContents(fullName, 'pages')
  var pages = contents.filter(obj => obj.type === 'dir').map(obj => obj.name)
  async.map(pages, (page, cb) => {
    getPageContents(github, fullName, page, cb)
  }, cb)
}

function getPageContents (github, fullName, page, cb) {
  async.waterfall([
    function getPageDirContents (cb) {
      github.getDirContents(fullName, `pages/${page}`, cb)
    },
    function getPageDataJson (res, cb) {
      var content = res.find(obj => obj.type === 'file' && obj.name === 'content.json')
      if (!content) return cb('Missing content.json')
      github.getFileContents(fullName, `pages/${page}/${content.name}`, cb)
    }
  ], (err, res) => {
    if (err) return cb(err)
    cb(null, {
      name: page,
      contents: JSON.parse(res)
    })
  })
}
