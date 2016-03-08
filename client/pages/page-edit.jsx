import React from 'react'
import fields from '../lib/field-lookup'

export default React.createClass({
  mixins: [ReactMeteorData],
  propTypes: {
    pageId: React.PropTypes.string,
    field: React.PropTypes.string
  },
  getMeteorData () {
    var pageSub = Meteor.subscribe('page', this.props.pageId)
    return {
      pageReady: pageSub.ready(),
      page: Pages.findOne({ _id: this.props.pageId })
    }
  },
  getInitialState () {
    return null
  },
  update (value) {
    this.setState({payload: value})
  },
  save (e) {
    e.preventDefault()
    let payload = {
      pageId: this.props.pageId,
      key: this.props.field,
      newValue: this.state.payload
    }
    Meteor.call('pages/updateContent', payload, (err, res) => {
      if (err) return console.error(err)
      FlowRouter.go('page', { pageId: this.props.pageId })
    })
  },
  render () {
    if (!this.data.pageReady) return (<div>Fetching content ...</div>)
    var props = {
      page: this.data.page,
      field: this.props.field,
      update: this.update,
      save: this.save
    }
    return (<PageField {...props} />)
  }
})

var PageField = React.createClass({
  propTypes: {
    page: React.PropTypes.object,
    field: React.PropTypes.string,
    update: React.PropTypes.func,
    save: React.PropTypes.func
  },
  getInitialState () {
    let page = this.props.page
    let field = this.props.field
    let type = (page.schema[field] && page.schema[field].type) || 'text'
    let content = page.content.json[field]
    return { type, content }
  },
  render () {
    let field = fields(this.state.type, this.state.content, this.props.update)
    return (
      <form>
        { field }
        <button onClick={ this.props.save } className='btn btn-primary'>Save</button>
      </form>
    )
  }
})
