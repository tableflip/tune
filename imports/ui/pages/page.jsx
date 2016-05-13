import React from 'react'
import { connect } from 'react-redux'
import { createContainer } from 'meteor/react-meteor-data'
import { Link } from 'react-router'
import Breadcrumbs from '../components/breadcrumbs'
import FieldPreview from '../components/field-preview'
import Projects from '/imports/api/projects/projects'
import Pages from '/imports/api/pages/pages'
import { subscribe } from '/imports/ui/redux/actions'

const Page = React.createClass({
  render () {
    if (!this.props.subsReady) return false
    let content = Object.keys(this.props.page.content.json)
    return (
      <div>
        <Breadcrumbs pages={[
          { text: this.props.page.name, active: true }
        ]} />
        <div className='container'>
          <p className='lead m-t-1'>Pick an item</p>
          <ul className='list-group'>
            {content.map((field, ind) => {
              let schema = this.props.page.schema[field]
              let value = this.props.page.content.json[field]
              return (
                <Link className='list-group-item' key={ind} to={`/project/${this.props.project._id}/page/${this.props.page._id}/edit?field=${field}`}>
                  <p><code>{field}</code></p>
                  <div><em>
                    <FieldPreview schema={schema} value={value} />
                  </em></div>
                </Link>
              ) }
            )}
          </ul>
        </div>
      </div>
    )
  }
})

const PageContainer = createContainer((props) => {
  props.subscribe('page', props.params.pageId)
  const page = Pages.findOne({ _id: props.params.pageId })
  return {
    page: page,
    project: Projects.findOne({ _id: page && page.project._id })
  }
}, Page)

function mapStateToProps ({ subscriptions }, ownProps) {
  return {
    params: ownProps.params,
    subsReady: subscriptions.ready
  }
}

const mapDispatchToProps = { subscribe }

export default connect(mapStateToProps, mapDispatchToProps)(PageContainer)
