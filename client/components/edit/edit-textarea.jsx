import React from 'react'

export default React.createClass({
  propTypes: {
    content: React.PropTypes.string,
    update: React.PropTypes.func,
    save: React.PropTypes.func
  },
  update: function (e) {
    this.props.update(this.refs.textarea.value)
  },
  render () {
    return (
      <form onSubmit={ this.props.save }>
        <textarea ref='textarea' className='form-control' rows='8' defaultValue={ this.props.content } onChange={ this.update }/>
      </form>
    )
  }
})
