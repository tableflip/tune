var counter = 0

Meteor.publish('page', function (pageId) {
  console.log(`Counter is at ${counter++}`)
  var page = Pages.findOne(pageId)
  if (!page) return this.ready()
  var project = Projects.findOne(page.project._id)
  if (!project) return this.ready()
  if (project.users.indexOf(this.userId) < 0) return this.ready()
  console.log('subscribing', page, pageId)
  return [
    Projects.find({ _id: page.project._id }),
    Pages.find(pageId)
  ]
})
