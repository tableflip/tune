import React from 'react'

const TextField = React.createClass({
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

const Textarea = React.createClass({
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

const components = {
  text: (content, submitHandler) => (<TextField content={ content } submitHandler={ submitHandler }/>),
  textarea: (content, submitHandler) => (<Textarea content={ content } submitHandler={ submitHandler }/>)
}

module.exports = function (type, content, submitHandler) {
  return components[type](content, submitHandler)
}
