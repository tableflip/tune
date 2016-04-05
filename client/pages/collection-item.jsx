import React from 'react'
import { connect } from 'react-redux'
import { get as getObjectPath } from 'object-path'
import Breadcrumbs from '../components/breadcrumbs'
import FieldPreview from '../components/field-preview'

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

  render () {
    if (this.props.spinnerVisible) return false
    let itemContent = getObjectPath(this.data.page.content.json, `${this.props.collectionName}.${this.props.index}`)
    let itemKeys = Object.keys(itemContent)
    return (
      <div>
        <Breadcrumbs pages={[
          { text: 'Home', href: '/' },
          { text: this.data.project.name, href: `/project/${this.data.project._id}` },
          { text: this.data.page.name, href: `/project/${this.data.project._id}/page/${this.data.page._id}` },
          { text: this.props.collectionName, href: `/project/${this.data.project._id}/page/${this.data.page._id}/edit?field=${this.props.collectionName}` },
          { text: this.props.index, active: true }
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
        </div>
      </div>
    )
  }
})

export default connect(state => state)(CollectionItem)
