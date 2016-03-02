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

const UnorderedList = React.createClass({
  propTypes: {
    content: React.PropTypes.array,
    submitHandler: React.PropTypes.func
  },
  getInitialState: function () {
    return {
      list: this.props.content
    }
  },
  update: function (e) {
    this.props.submitHandler(this.refs.textarea.value)
  },
  move: function (index, dir, e) {
    e.preventDefault()
    if (dir < 0 && index === 0 || dir > 0 && index === this.state.list.length - 1) return
    let top = this.state.list.slice(0, index)
    let bottom = this.state.list.slice(index, this.state.list.length)
    let moving = bottom.shift()
    if (dir < 0) {
      bottom.unshift(top.pop())
      top.push(moving)
    }
    if (dir > 0) {
      top.push(bottom.shift())
      bottom.unshift(moving)
    }
    this.setState({list: _.union(top, bottom)})
  },
  addItem: function (e) {
    e.preventDefault()
    let newList = this.state.list
    newList.push(this.refs.addItem.value)
    this.setState({list: newList})
    this.refs.addItem.value = ''
  },
  render () {
    return (
      <ul>
        { this.state.list.map((item, i) => {
          return <li key={ i + item.replace(' ', '-') }>
              <button onClick={ this.move.bind(null, i, -1) } >&uarr;</button>
              <button onClick={ this.move.bind(null, i, 1) } >&darr;</button>
              &nbsp;
              { item }
            </li>
        })}
        <input placeholder='Add an Item' ref='addItem'/>
        <button onClick={ this.addItem }>+</button>
      </ul>
    )
  }
})

const components = {
  text: (content, submitHandler) => (<TextField content={ content } submitHandler={ submitHandler }/>),
  textarea: (content, submitHandler) => (<Textarea content={ content } submitHandler={ submitHandler }/>),
  list: (content, submitHandler) => (<UnorderedList content={ content } submitHandler={ submitHandler }/>)
}

module.exports = function (type, content, submitHandler) {
  return components[type](content, submitHandler)
}
