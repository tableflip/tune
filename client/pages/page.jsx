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
    let fieldNames = Object.keys(this.data.page.content.json)
    return (
      <div>
        <Breadcrumbs pages={[
          { text: 'Home', href: '/' },
          { text: this.data.project.name, href: `/project/${this.data.project._id}` },
          { text: this.data.page.name, active: true }
        ]} />
        <div className="container">
          <p className="lead m-t-1">Pick an item</p>
          <ul className="list-group">
            {fieldNames.map((fieldName, ind) => {
              let fieldObj = this.data.page.content.json[fieldName]
              let schema = fieldObj.schema
              let type = schema && schema.type
              let value = fieldObj.value
              return (
                <a className='list-group-item' key={ind} href={`/project/${this.data.project._id}/page/${this.data.page._id}/edit?field=${fieldName}`}>
                  <p><code>{fieldName}</code></p>
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
