import { Mongo } from 'meteor/mongo'

let Pages = new Mongo.Collection('pages')
Pages.rootName = 'Site Settings'

export default Pages
