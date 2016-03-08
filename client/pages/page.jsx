import React from 'react'
import Loader from 'react-loader'
import { Breadcrumbs } from '../components/breadcrumbs'

export default React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData () {
    var pageSub = Meteor.subscribe('page', this.props.pageId)
    let page = Pages.findOne({ _id: this.props.pageId })
    return {
      pageReady: pageSub.ready(),
      page: page,
      project: Projects.findOne({ _id: page && page.project._id })
    }
  },

  render () {
    if (!this.data.pageReady) return (<Loader loaded={false} />)
    let content = Object.keys(this.data.page.content.json)
    return (
      <div>
        <Breadcrumbs pages={[
          { text: 'home', href: '/' },
          { text: this.data.project.full_name, href: `/project/${this.data.project._id}` },
          { text: this.data.page.name, active: true }
        ]} />
        <div className="container">
          <h3 className="m-t-1 m-b-2">{this.data.page.name}</h3>
          <ul className="list-group">
            {content.map((field, ind) => (
              <a className="list-group-item" key={ind} href={`/page/${this.data.page._id}?field=${field}`}>
                <h5 className="list-group-item-heading">{field}</h5>
                <p className="list-group-item-text"><em>{this.data.page.content.json[field]}</em></p>
              </a>
            ))}
          </ul>
        </div>
      </div>
    )
  }
})
