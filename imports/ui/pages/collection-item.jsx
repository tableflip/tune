import React from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import { createContainer } from 'meteor/react-meteor-data'
import { get as getObjectPath } from 'object-path'
import { Meteor } from 'meteor/meteor'
import isEqual from 'is-equal'
import Breadcrumbs from '../components/breadcrumbs'
import FieldPreview from '../components/field-preview'
import ValidationError from '../components/validation-error'
import OverlayLoader from '../components/loader/loader-overlay'
import getPrimaryField from '/imports/lib/validation/get-primary-field'
import { setPreferredSlideDirection, preventChildSwipe, setCollectionSize } from '../redux/actions'
import Projects from '/imports/api/projects/projects'
import Pages from '/imports/api/pages/pages'

const CollectionItem = React.createClass({
  propTypes: {
    pageReady: React.PropTypes.bool,
    params: React.PropTypes.object,
    page: React.PropTypes.object,
    pageId: React.PropTypes.string,
    project: React.PropTypes.object,
    collectionName: React.PropTypes.string,
    setPreferredSlideDirection: React.PropTypes.func,
    preventChildSwipe: React.PropTypes.func,
    subsReady: React.PropTypes.bool
  },

  getInitialState () {
    return {
      validationError: '',
      saving: false
    }
  },

  remove (e) {
    e.preventDefault()
    if (!window.confirm('Are you sure you want to delete this item?')) return

    this.setState({ saving: true }, () => {
      Meteor.call('pages/removeCollectionItem', {
        pageId: this.props.params.pageId,
        collectionName: this.props.params.collectionName,
        index: parseInt(this.props.params.index, 10)
      }, err => {
        this.setState({ saving: false })
        if (err) return this.setState({ validationError: err.details || err.reason || 'Could not remove entry' })
        browserHistory.push(`/project/${this.props.params.projectId}/page/${this.props.params.pageId}/edit?field=${this.props.params.collectionName}`)
      })
    })
  },

  navAction (n) {
    let items = this.props.page.content.json[this.props.params.collectionName]
    let index = parseInt(this.props.params.index, 10)
    if (items[index + n]) {
      return {
        action: () => {
          this.props.setPreferredSlideDirection(n > 0 ? 'left' : 'right')
          browserHistory.push(`/project/${this.props.params.projectId}/page/${this.props.params.pageId}/collection/${this.props.params.collectionName}/${(index + n).toString()}`)
        }
      }
    } else {
      return {
        disabled: true,
        action: () => {}
      }
    }
  },

  checkForwardButton (prevProps) {
    if (!this.props.pageReady) return
    if (prevProps && isEqual(prevProps.page, this.props.page)) return
    let itemContent = this.props.page.content.json[this.props.params.collectionName]
    if (!itemContent[parseInt(this.props.params.index, 10) + 1]) {
      this.props.preventChildSwipe()
    }
  },
  componentWillMount () {
    this.checkForwardButton()
  },
  componentWillReceivePops (prevProps) {
    this.checkForwardButton(prevProps)
  },

  // don't rerender whilst we're saving state (i.e. removing an element)
  shouldComponentUpdate (nextProps, nextState) {
    return !this.state.saving
  },

  render () {
    if (!this.props.subsReady || !this.props.page) return false
    let itemContent = getObjectPath(this.props.page.content.json, `${this.props.params.collectionName}.${this.props.params.index}`)
    // this is necessary as when we remove the item the page rerenders immediately before the redirect and
    // the render function would throw an error if we deleted the last element and the object path was no longer valid
    if (!itemContent) return false
    let schema = getObjectPath(this.props.page.content.json, `${this.props.params.collectionName}.0`)
    let itemKeys = Object.keys(itemContent)
    let navLeft = this.navAction(-1)
    let navRight = this.navAction(1)
    return (
      <div>
        <Breadcrumbs pages={[
          { text: this.props.page.name, href: `/project/${this.props.params.projectId}/page/${this.props.params.pageId}` },
          { text: this.props.params.collectionName, href: `/project/${this.props.params.projectId}/page/${this.props.params.pageId}/edit?field=${this.props.params.collectionName}` },
          { text: itemContent[getPrimaryField(schema)] || this.props.params.index, active: true }
        ]} />
        <div className='container'>
          <p className='lead m-t-1'>Pick an item</p>
          <ul className='list-group m-y-1'>
            {itemKeys.map((field, ind) => {
              let schema = getObjectPath(this.props.page.schema, `${this.props.params.collectionName}.0.${field}`)
              let value = itemContent[field]
              let fieldPath = `${this.props.params.collectionName}.${this.props.params.index}.${field}`
              return (
                <Link className='list-group-item' key={ind} to={`/project/${this.props.params.projectId}/page/${this.props.params.pageId}/collection/${this.props.params.collectionName}/${ind}/edit?field=${fieldPath}`} >
                  <p><code>{field}</code></p>
                  <div><em>
                    <FieldPreview schema={schema} value={value} />
                  </em></div>
                </Link>
              ) }
            )}
          </ul>
          <nav className='m-t-1 text-xs-center'>
            <button disabled={navLeft.disabled} onClick={navLeft.action} className='btn btn-lg btn-secondary pull-left'>&laquo;</button>
            <button className='btn btn-lg btn-danger' onClick={this.remove}>Delete Item</button>
            <button disabled={navRight.disabled} onClick={navRight.action} className='btn btn-lg btn-secondary pull-right'>&raquo;</button>
          </nav>
          <div className='clearfix m-b-1'></div>
          <ValidationError message={this.state.validationError} />
        </div>
        <OverlayLoader loaded={!this.state.saving} />
      </div>
    )
  }
})

const CollectionItemContainer = createContainer(props => {
  const page = Pages.findOne({ _id: props.params.pageId })
  if (page) {
    let collection = page.content.json[props.params.collectionName]
    if (collection) props.setCollectionSize(collection.length)
  }
  return Object.assign({}, props, {
    page: page,
    project: Projects.findOne({ _id: page && page.project._id })
  })
}, CollectionItem)

function mapStateToProps ({ subscriptions }, ownProps) {
  return {
    subsReady: subscriptions.ready,
    params: ownProps.params
  }
}

const mapDispatchToProps = {
  setPreferredSlideDirection,
  preventChildSwipe,
  setCollectionSize
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionItemContainer)
