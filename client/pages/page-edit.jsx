import React from 'react'
import Loader from 'react-loader'
import { Breadcrumbs } from '../components/breadcrumbs'
import fields from '../components/field-lookup'

export default React.createClass({
  mixins: [ReactMeteorData],
  propTypes: {
    pageId: React.PropTypes.string,
    field: React.PropTypes.string
  },
  getMeteorData () {
    var pageSub = Meteor.subscribe('page', this.props.pageId)
    let page = Pages.findOne({ _id: this.props.pageId })
    return {
      pageReady: pageSub.ready(),
      page: page,
      project: Projects.findOne({ _id: page && page.project._id })
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
    if (!this.data.pageReady) return (<Loader loaded={false} />)
    var props = {
      page: this.data.page,
      project: this.data.project,
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
    project: React.PropTypes.object,
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
      <div>
        <Breadcrumbs pages={[
          { text: 'home', href: '/' },
          { text: this.props.project.full_name, href: `/project/${this.props.project._id}` },
          { text: this.props.page.name, href: `/page/${this.props.page._id}` }
        ]} />
        <div className="container">
          <h3 className="m-t-1 m-b-2">{this.props.field}</h3>
          <form>
            <p>
              { field }
            </p>
            <p>
              <button onClick={ this.props.save } className='btn btn-primary'>Save</button>
              <a href={`/page/${this.props.page._id}`} className="btn btn-link">Cancel</a>
            </p>
          </form>
        </div>
      </div>
    )
  }
})
