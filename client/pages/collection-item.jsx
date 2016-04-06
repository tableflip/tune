import React from 'react'
import { connect } from 'react-redux'
import { get as getObjectPath } from 'object-path'
import Breadcrumbs from '../components/breadcrumbs'
import FieldPreview from '../components/field-preview'
import getPrimaryField from '/lib/imports/get-primary-field'

const CollectionItem = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData () {
    var pageSub = Subs.subscribe('page', this.props.pageId)
    let page = Pages.findOne({ _id: this.props.pageId })
    return {
      pageReady: pageSub.ready(),
      page: page,
      project: Projects.findOne({ _id: page && page.project._id })
    }
  },

  navAction (n) {
    let items = getObjectPath(this.data.page.content.json, `${this.props.collectionName}`)
    let index = parseInt(this.props.index, 10)
    if (items[index + n]) {
      return {
        action: () => {
          FlowRouter.go('collection-item', {
            projectId: this.data.project && this.data.project._id,
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

  render () {
    if (this.props.spinnerVisible) return false
    let itemContent = getObjectPath(this.data.page.content.json, `${this.props.collectionName}.${this.props.index}`)
    let schema = getObjectPath(this.data.page.content.json, `${this.props.collectionName}.0`)
    let itemKeys = Object.keys(itemContent)
    let navLeft = this.navAction(-1)
    let navRight = this.navAction(1)
    return (
      <div>
        <Breadcrumbs pages={[
          { text: 'Home', href: '/' },
          { text: this.data.project.name, href: `/project/${this.data.project._id}` },
          { text: this.data.page.name, href: `/project/${this.data.project._id}/page/${this.data.page._id}` },
          { text: this.props.collectionName, href: `/project/${this.data.project._id}/page/${this.data.page._id}/edit?field=${this.props.collectionName}` },
          { text: itemContent[getPrimaryField(schema)] || this.props.index, active: true }
        ]} />
        <div className="container">
          <p className="lead m-t-1">Pick an item</p>
          <ul className="list-group">
            {itemKeys.map((field, ind) => {
              let schema = getObjectPath(this.data.page.schema, `${this.props.collectionName}.0.${field}`)
              let value = itemContent[field]
              let fieldPath = `${this.props.collectionName}.${this.props.index}.${field}`
              return (
                <a className='list-group-item' key={ind} href={`/project/${this.data.project._id}/page/${this.data.page._id}/edit?field=${fieldPath}`}>
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
        </div>
      </div>
    )
  }
})

export default connect(state => state)(CollectionItem)
