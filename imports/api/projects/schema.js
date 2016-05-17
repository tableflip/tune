import SimpleSchema from 'meteor/aldeed:simple-schema'

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
  users: {
    type: [String],
    regEx: SimpleSchema.RegEx.Id
  }
})
