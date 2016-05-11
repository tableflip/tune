import React from 'react'

let CurrentPage = React.createClass({
  render () {
    return (<li key={this.props.key} className='active'>{this.props.text}</li>)
  }
})

let LinkPage = React.createClass({
  render () {
    return (<li key={this.props.key}><a href={this.props.href}>{this.props.text}</a></li>)
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
