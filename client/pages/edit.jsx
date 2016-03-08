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
  getInitialState: () => {
    return null
  },
  updateState: function (value) {
    this.setState({payload: value})
  },
  save: function (e) {
    e.preventDefault()
    Meteor.call('pages/updateContent', {
      pageId: this.props.pageId,
      key: this.props.field,
      newValue: this.state.payload
    }, (err, res) => {
      if (err) return console.error(err)
      FlowRouter.go(`/page/${this.props.pageId}`)
    })
  },
  render () {
    if (!this.data.pageReady) return (<div>Fetching your content ...</div>)
    var props = {page: this.data.page, field: this.props.field, save: this.save}
    return (<PageField {...props} />)
  }
})

var PageField = React.createClass({
  propTypes: {
    page: React.PropTypes.object,
    field: React.PropTypes.string,
    save: React.PropTypes.func
  },
  getInitialState () {
    let page = this.props.page
    var type = (page.schema[this.props.field] && page.schema[this.props.field].type) || 'text'
    var content = page.content.json[this.props.field]
    console.log('PageField', { type: type, content: content }, page)
    return { type: type, content: content }
  },
  render () {
    let field = fields(this.state.type, this.state.content, this.updateState)
    return (
      <form>
        <fieldset className='form-group'>
          { field }
        </fieldset>
        <fieldset className='form-group'>
          <button onClick={ this.props.save } className='btn btn-primary'>Save</button>
        </fieldset>
      </form>
    )
  }
})
