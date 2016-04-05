import React from 'react'
import { connect } from 'react-redux'
import { get as getObjectPath } from 'object-path'
import OverlayLoader from '../components/overlay-loader'
import Breadcrumbs from '../components/breadcrumbs'
import ValidationError from '../components/validation-error'
import fieldComponentLookup from '../components/field-component-lookup'
import * as validator from '/lib/imports/validator'

const PageEdit = React.createClass({
  mixins: [ReactMeteorData],
  propTypes: {
    pageId: React.PropTypes.string,
    field: React.PropTypes.string
  },
  getMeteorData () {
    var pageSub = Subs.subscribe('page', this.props.pageId)
    let page = Pages.findOne({ _id: this.props.pageId })
    return {
      pageReady: pageSub.ready(),
      page: page,
      project: Projects.findOne({ _id: page && page.project._id })
    }
  },
  render () {
    console.log(this.props)
    if (this.props.spinnerVisible) return false
    var props = {
      page: this.data.page,
      project: this.data.project,
      field: this.props.field
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
    field: React.PropTypes.string
  },
  getInitialState () {
    let page = this.props.page
    let field = this.props.field
    let schema = page.schema[field]
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
  save (e) {
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
      FlowRouter.go('page', { pageId: this.props.page._id, projectId: this.props.project._id })
    })
  },
  render () {
    let fieldComponent = fieldComponentLookup({
      field: this.props.field,
      schema: this.state.schema,
      content: this.state.content,
      update: this.update,
      save: this.save
    })
    return (
      <div>
        <Breadcrumbs pages={[
          { text: 'Home', href: '/' },
          { text: this.props.project.name, href: `/project/${this.props.project._id}` },
          { text: this.props.page.name, href: `/project/${this.props.project._id}/page/${this.props.page._id}` }
        ]} />
        <div className="container">
          <p>Edit <code>{this.props.field}</code></p>
          <div className="m-y-1">
            { fieldComponent }
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

export default connect(({ spinnerVisible }) => ({ spinnerVisible }))(PageEdit)
