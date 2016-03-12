import React from 'react'
import { connect } from 'react-redux'
import Breadcrumbs from '../components/breadcrumbs'
import FieldPreview from '../components/field-preview'

const Page = React.createClass({
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
    let content = Object.keys(this.data.page.content.json)
    return (
      <div>
        <Breadcrumbs pages={[
          { text: 'Home', href: '/' },
          { text: 'Site', href: `/project/${this.data.project._id}` },
          { text: this.data.page.name, active: true }
        ]} />
        <div className="container">
          <p className="lead m-t-1">Pick an item</p>
          <ul className="list-group">
            {content.map((field, ind) => {
              let schema = this.data.page.schema[field]
              let type = schema && schema.type
              let value = this.data.page.content.json[field]
              return (
                <a className='list-group-item' key={ind} href={`/project/${this.data.project._id}/page/${this.data.page._id}/edit?field=${field}`}>
                  <p><code>{field}</code></p>
                  <div><em>
                    <FieldPreview type={type} value={value} />
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

export default connect(state => state)(Page)
