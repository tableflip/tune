import React from 'react'
import { connect } from 'react-redux'
import { createContainer } from 'meteor/react-meteor-data';
import { get as getObjectPath } from 'object-path'
import Breadcrumbs from '../components/breadcrumbs'
import FieldPreview from '../components/field-preview'
import ValidationError from '../components/validation-error'
import OverlayLoader from '../components/overlay-loader'
import getPrimaryField from '/lib/imports/get-primary-field'
import store from '../redux/store'
import { setPreferredSlideDirection } from '../redux/action-creators'

const CollectionItem = connect(state => state)(React.createClass({
  propTypes: {
    pageId: React.PropTypes.string,
    collectionName: React.PropTypes.string,
    index: React.PropTypes.string
  },

  getInitialState () {
    return {
      validationError: '',
      saving: false
    }
  },

  remove (e) {
    e.preventDefault()
    this.setState({ saving: true }, () => {
      Meteor.call('pages/removeCollectionItem', {
        pageId: this.props.pageId,
        collectionName: this.props.collectionName,
        index: parseInt(this.props.index, 10)
      }, err => {
        this.setState({ saving: false })
        if (err) return this.setState({ validationError: err.details || err.reason || 'Could not remove entry' })
        FlowRouter.go('page-edit', {
          projectId: this.props.project && this.props.project._id,
          pageId: this.props.pageId
        },
        {
          field: this.props.collectionName
        })
      })
    })
  },

  navAction (n) {
    let items = getObjectPath(this.props.page.content.json, `${this.props.collectionName}`)
    let index = parseInt(this.props.index, 10)
    if (items[index + n]) {
      return {
        action: () => {
          store.dispatch(setPreferredSlideDirection(n > 0 ? 'left' : 'right'))
          FlowRouter.go('collection-item', {
            projectId: this.props.project && this.props.project._id,
            pageId: this.props.pageId,
            collectionName: this.props.collectionName,
            index: (index + n).toString()
          })
        }
      }
    } else {
      return {
        disabled: true,
        action: () => {}
      }
    }
  },

  // don't rerender whilst we're saving state (i.e. removing an element)
  shouldComponentUpdate (nextProps, nextState) {
    return !this.state.saving
  },

  render () {
    if (this.props.spinnerVisible) return false
    let itemContent = getObjectPath(this.props.page.content.json, `${this.props.collectionName}.${this.props.index}`)
    // this is necessary as when we remove the item the page rerenders immediately before the redirect and
    // the render function would throw an error if we deleted the last element and the object path was no longer valid
    if (!itemContent) return false
    let schema = getObjectPath(this.props.page.content.json, `${this.props.collectionName}.0`)
    let itemKeys = Object.keys(itemContent)
    let navLeft = this.navAction(-1)
    let navRight = this.navAction(1)
    return (
      <div>
        <Breadcrumbs pages={[
          { text: this.props.page.name, href: `/project/${this.props.project._id}/page/${this.props.page._id}` },
          { text: this.props.collectionName, href: `/project/${this.props.project._id}/page/${this.props.page._id}/edit?field=${this.props.collectionName}` },
          { text: itemContent[getPrimaryField(schema)] || this.props.index, active: true }
        ]} />
        <div className="container">
          <button className='pull-right btn btn-danger' onClick={this.remove}><i className="fa fa-remove"></i></button>
          <p className="lead m-t-1">Pick an item</p>
          <ul className="list-group">
            {itemKeys.map((field, ind) => {
              let schema = getObjectPath(this.props.page.schema, `${this.props.collectionName}.0.${field}`)
              let value = itemContent[field]
              let fieldPath = `${this.props.collectionName}.${this.props.index}.${field}`
              return (
                <a className='list-group-item' key={ind} href={`/project/${this.props.project._id}/page/${this.props.page._id}/edit?field=${fieldPath}`}>
                  <p><code>{field}</code></p>
                  <div><em>
                    <FieldPreview schema={schema} value={value} />
                  </em></div>
                </a>
              )}
            )}
          </ul>
          <nav className="m-t-1">
            <button disabled={navLeft.disabled} onClick={navLeft.action} className="btn btn-lg btn-secondary pull-left">&laquo;</button>
            <button disabled={navRight.disabled} onClick={navRight.action} className="btn btn-lg btn-secondary pull-right">&raquo;</button>
          </nav>
          <div className="clearfix m-b-1"></div>
          <ValidationError message={this.state.validationError} />
        </div>
        <OverlayLoader loaded={!this.state.saving} />
      </div>
    )
  }
}))

const CollectionItemContainer = createContainer(props => {
  var pageSub = Subs.subscribe('page', props.pageId)
  let page = Pages.findOne({ _id: props.pageId })
  return Object.assign({}, props, {
    pageReady: pageSub.ready(),
    page: page,
    project: Projects.findOne({ _id: page && page.project._id })
  })
}, CollectionItem)

export default CollectionItemContainer
