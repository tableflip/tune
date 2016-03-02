import React from 'react'

export default React.createClass({
  propTypes: {
    content: React.PropTypes.string,
    submitHandler: React.PropTypes.func
  },
  update: function (e) {
    this.props.submitHandler(this.refs.textarea.value)
  },
  render () {
    return (
      <textarea ref='textarea' className='form-control' rows='8' defaultValue={ this.props.content } onChange={ this.update }/>
    )
  }
})
