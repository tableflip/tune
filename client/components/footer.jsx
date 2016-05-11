import React from 'react'
import { connect } from 'react-redux'

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
      <footer className='footer text-xs-center bg-inverse' style={style}>
        <a className='tableflip' href='/'>TABLEFLIP</a>
      </footer>
    )
  }
})

export default connect(state => state)(Footer)
