export default new SimpleSchema({
  name: {
    type: String
  },
  'project.full_name': {
    type: String,
  },
  'project._id': {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  'isRoot': {
    type: Boolean
  },
  'directory.sha': {
    type: String
  },
  'content.sha': {
    type: String
  },
  'content.json': {
    type: Object,
    blackbox: true
  }
})
