import React from 'react'

export default React.createClass({
  propTypes: {
    content: React.PropTypes.string,
    parentState: React.PropTypes.func
  },
  update: function (e) {
    this.props.parentState(this.refs.text.value)
  },
  render () {
    return (
      <input type='text' className='form-control' ref='text' defaultValue={ this.props.content } onChange={ this.update }/>
    )
  }
})
