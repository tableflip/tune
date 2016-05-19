import React from 'react'
import { Meteor } from 'meteor/meteor'
import { connect } from 'react-redux'
import { createContainer } from 'meteor/react-meteor-data'
import { Link, browserHistory } from 'react-router'
import { get as getObjectPath } from 'object-path'
import OverlayLoader from '../components/loader/loader-overlay'
import Breadcrumbs from '../components/breadcrumbs'
import ValidationError from '../components/validation-error'
import fieldComponentLookup from '../components/field-component-lookup'
import * as validator from '/imports/lib/validation/validator'
import Projects from '/imports/api/projects/projects'
import Pages from '/imports/api/pages/pages'

const PageField = React.createClass({
  propTypes: {
    page: React.PropTypes.object,
    project: React.PropTypes.object,
    field: React.PropTypes.string,
    subsReady: React.PropTypes.bool
  },
  getInitialState () {
    let page = this.props.page
    let field = this.props.field
    let schema = getObjectPath(page.schema, validator.schemaKey(field))
    let content = getObjectPath(page.content.json, field)
    let newContent = (content instanceof Object) ? Object.assign({}, content) : content
    return { schema, content, newContent }
  },
  isValid () {
    let validation = validator.validateDocField({
      doc: this.props.page,
      field: this.props.field,
      newValue: this.state.newContent
    })
    if (validation.error) {
      this.setState({ validationError: validation.error })
    } else {
      this.setState({ validationError: null })
    }
    return !validation.error
  },
  update (newContent) {
    this.setState({ newContent })
  },
  save (e, cb) {
    e.preventDefault()
    if (!this.isValid()) return
    let payload = {
      pageId: this.props.page._id,
      key: this.props.field,
      newValue: this.state.newContent
    }
    this.setState({ saving: true })
    Meteor.call('pages/updateContent', payload, (err, res) => {
      this.setState({ saving: false })
      if (err) {
        this.setState({ validationError: 'Cannot update page data' })
        return console.error(err)
      }
      if (cb instanceof Function) return cb()
      let collectionDetails = validator.collectionKeyRegex.exec(this.props.field)
      if (collectionDetails) return browserHistory.push(`/project/${this.props.project._id}/page/${this.props.page._id}/collection/${collectionDetails[1]}/${collectionDetails[2]}`)
      browserHistory.push(`/project/${this.props.project._id}/page/${this.props.page._id}`)
    })
  },
  getCancelLink () {
    let fieldDetails = validator.collectionKeyRegex.exec(this.props.field)
    if (fieldDetails) {
      return `/project/${this.props.project._id}/page/${this.props.page._id}/collection/${fieldDetails[1]}/${fieldDetails[2]}`
    } else {
      return `/project/${this.props.project._id}/page/${this.props.page._id}`
    }
  },
  render () {
    if (!this.props.subsReady || !this.props.page) return false
    let fieldComponent = fieldComponentLookup({
      field: this.props.field,
      pageId: this.props.page._id,
      projectId: this.props.project._id,
      schema: this.state.schema,
      content: this.state.content,
      update: this.update,
      save: this.save
    })
    let cancelLink = this.getCancelLink()
    return (
      <div>
        <Breadcrumbs pages={[
          { text: this.props.page.name, href: `/project/${this.props.project._id}/page/${this.props.page._id}` }
        ]} />
        <div className='container'>
          <p>Edit <code>{this.props.field}</code></p>
          <div className='m-y-1'>
            {fieldComponent}
          </div>
          <ValidationError message={this.state.validationError} />
          <div className='m-b-1'>
            <button onClick={this.save} className='btn btn-primary'>Save</button>
            <Link to={cancelLink} className='btn btn-link'>Cancel</Link>
          </div>
        </div>
        <OverlayLoader loaded={!this.state.saving} />
      </div>
    )
  }
})

const PageEdit = React.createClass({
  propTypes: {
    page: React.PropTypes.object,
    subsReady: React.PropTypes.bool
  },
  render () {
    if (!this.props.subsReady || !this.props.page) return false
    return (
      <div>
        <PageField {...this.props} />
      </div>
    )
  }
})

const PageEditContainer = createContainer((props) => {
  const page = Pages.findOne({ _id: props.params.pageId })
  return {
    page: page,
    project: Projects.findOne({ _id: page && page.project._id }),
    field: props.queryParams.field
  }
}, PageEdit)

function mapStateToProps ({ subscriptions }, ownProps) {
  return {
    subsReady: subscriptions.ready,
    params: ownProps.params,
    queryParams: ownProps.location.query
  }
}

export default connect(mapStateToProps)(PageEditContainer)
