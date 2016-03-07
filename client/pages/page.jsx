import React from 'react'

export default React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData () {
    var pageSub = Meteor.subscribe('page', this.props.pageId)
    return {
      pageReady: pageSub.ready(),
      page: Pages.findOne({ _id: this.props.pageId })
    }
  },

  render () {
    if (!this.data.pageReady) return (<div>Loading...</div>)
    let content = Object.keys(this.data.page.content.json)
    return (
      <div>
        <h1>{this.data.page.name}</h1>
        <ul className='list-group'>
          {content.map((field, ind) => (<li className='list-group-item' key={ind}><a href={`/page/${this.data.page._id}?field=${field}`}>{field} - {this.data.page.content.json[field]}</a></li>))}
        </ul>
      </div>
    )
  }
})
