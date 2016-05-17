import React from 'react'
import { Link } from 'react-router'

const CurrentPage = React.createClass({
  render () {
    return (<li className='active'>{this.props.text}</li>)
  }
})

const LinkPage = React.createClass({
  render () {
    return (<li><Link to={this.props.href}>{this.props.text}</Link></li>)
  }
})

export default React.createClass({
  render () {
    return (
      <ol className='breadcrumb'>
        {this.props.pages.map((page, ind) =>
          page.active ? (<CurrentPage key={ind} {...page} />) : (<LinkPage key={ind} {...page} />)
        )}
      </ol>
    )
  }
})
