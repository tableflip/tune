import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

const Footer = React.createClass({
  render () {
    let style = {
      transition: 'max-height 500ms, padding 500ms',
      paddingTop: this.props.footerVisible ? '1rem' : 0,
      paddingBottom: this.props.footerVisible ? '1rem' : 0,
      maxHeight: this.props.footerVisible ? '100px' : 0,
      overflowY: 'hidden'
    }
    return (
      <footer className="footer text-xs-center bg-inverse" style={style}>
        <Link className="tableflip" to="/">TABLEFLIP</Link>
      </footer>
    )
  }
})

export default connect(state => state)(Footer)
