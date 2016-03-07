import React from 'react'
import fields from '../lib/field-lookup'

export default React.createClass({
  mixins: [ReactMeteorData],
  propTypes: {
    pageId: React.PropTypes.string,
    field: React.PropTypes.string
  },
  getMeteorData () {
    var pageSub = Meteor.subscribe('page', this.props.pageId, () => {
      let page = Pages.findOne(this.props.pageId)
      if (!page) return
      var type = (page.schema[this.props.field] && page.schema[this.props.field].type) || 'text'
      var content = page.content.json[this.props.field]
      this.setState({ type: type, content: content })
    })
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
    if (!this.state) return (<div>Fetching your content ...</div>)
    let field = fields(this.state.type, this.state.content, this.updateState)
    return (
      <form>
        <fieldset className='form-group'>
          { field }
        </fieldset>
        <fieldset className='form-group'>
          <button onClick={ this.save } className='btn btn-primary'>Save</button>
        </fieldset>
      </form>
    )
  }
})
