import { Mongo } from 'meteor/mongo'
import everything from '/imports/lib/everything'

const Projects = new Mongo.Collection('projects')

Projects.deny(everything)

export default Projects
