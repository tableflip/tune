import React from 'react'
import { connect } from 'react-redux'
import { get as getObjectPath } from 'object-path'
import OverlayLoader from '../components/overlay-loader'
import Breadcrumbs from '../components/breadcrumbs'
import ValidationError from '../components/validation-error'
import fields from '../components/field-lookup'
import * as validator from '/lib/imports/validator'

const PageEdit = React.createClass({
  mixins: [ReactMeteorData],
  propTypes: {
    pageId: React.PropTypes.string,
    fieldPath: React.PropTypes.string
  },
  getMeteorData () {
    var pageSub = Subs.subscribe('page', this.props.pageId)
    let page = Pages.findOne({ _id: this.props.pageId })
    return {
      pageReady: pageSub.ready(),
      page: page,
      project: Projects.findOne({ _id: page && page.project._id }),
      field: getObjectPath(page, `content.json.${this.props.fieldPath}`)
    }
  },
  render () {
    if (this.props.spinnerVisible || !this.data.page) return false
    var props = {
      page: this.data.page,
      project: this.data.project,
      fieldPath: this.props.fieldPath,
      field: this.data.field
    }
    return (
      <div>
        <PageField {...props} />
      </div>
    )
  }
})

const PageField = React.createClass({
  propTypes: {
    page: React.PropTypes.object,
    project: React.PropTypes.object,
    fieldPath: React.PropTypes.string,
    field: React.PropTypes.object
  },
  getInitialState () {
    let field = this.props.field
    let type = field.schema.type || 'text'
    let content = field.value
    let newContent = (content instanceof Object) ? Object.assign({}, content) : content
    return { type, content, newContent }
  },
  isValid () {
    let validation = validator.validateField({
      schema: this.props.field.schema,
      val: this.state.newContent
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
  save (e) {
    e.preventDefault()
    if (!this.isValid()) return
    let payload = {
      pageId: this.props.page._id,
      fieldPath: this.props.fieldPath,
      newValue: this.state.newContent
    }
    this.setState({ saving: true })
    Meteor.call('pages/updateContent', payload, (err, res) => {
      this.setState({ saving: false })
      if (err) {
        this.setState({ validationError: 'Cannot update page data' })
        return console.error(err)
      }
      FlowRouter.go('page', { pageId: this.props.page._id, projectId: this.props.project._id })
    })
  },
  render () {
    let field = fields(this.state.type, this.state.content, this.update, this.save)
    return (
      <div>
        <Breadcrumbs pages={[
          { text: 'Home', href: '/' },
          { text: this.props.project.name, href: `/project/${this.props.project._id}` },
          { text: this.props.page.name, href: `/project/${this.props.project._id}/page/${this.props.page._id}` }
        ]} />
        <div className="container">
          <p>Edit <code>{this.props.fieldPath}</code></p>
          <div className="m-y-1">
            { field }
          </div>
          <ValidationError message={this.state.validationError} />
          <div className="m-b-1">
            <button onClick={ this.save } className='btn btn-primary'>Save</button>
            <a href={`/project/${this.props.project._id}/page/${this.props.page._id}`} className="btn btn-link">Cancel</a>
          </div>
        </div>
        <OverlayLoader loaded={!this.state.saving} />
      </div>
    )
  }
})

export default connect(state => state)(PageEdit)
