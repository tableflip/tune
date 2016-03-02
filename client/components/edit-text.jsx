import React from 'react'

export default React.createClass({
  propTypes: {
    content: React.PropTypes.string,
    submitHandler: React.PropTypes.func
  },
  update: function (e) {
    this.props.submitHandler(this.refs.text.value)
  },
  render () {
    return (
      <input type='text' className='form-control' ref='text' defaultValue={ this.props.content } onChange={ this.update }/>
    )
  }
})
