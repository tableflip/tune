import { Mongo } from 'meteor/mongo'
import everything from '/imports/lib/everything'

let Pages = new Mongo.Collection('pages')
Pages.rootName = 'Site Settings'

Pages.deny(everything)

export default Pages
