export default new SimpleSchema({
  name: {
    type: String
  },
  full_name: {
    type: String
  },
  'lastCommmit.sha': {
    type: String
  },
  'lastCommmit.dateTime': {
    type: Date
  },
  'facts.sha': {
    type: String
  },
  'facts.json': {
    type: Object,
    blackbox: true
  },
  schema: {
    type: Object,
    blackbox: true
  },
  users: {
    type: [String],
    regEx: SimpleSchema.RegEx.Id
  }
})
