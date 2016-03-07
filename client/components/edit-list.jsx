import React from 'react'

export default React.createClass({
  propTypes: {
    content: React.PropTypes.array,
    parentState: React.PropTypes.func
  },
  getInitialState: function () {
    return { list: this.props.content }
  },
  componentDidMount: function () {
    this.update()
  },
  update: function () {
    this.props.parentState(this.state.list)
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
    this.setState({list: _.union(top, bottom)}, this.update)
  },
  addItem: function (e) {
    e.preventDefault()
    if (this.refs.addItem.value === '') return
    let newList = this.state.list
    newList.push(this.refs.addItem.value)
    this.refs.addItem.value = ''
    this.setState({list: newList}, this.update)
  },
  remove: function (index, e) {
    e.preventDefault()
    let top = this.state.list.slice(0, index)
    let bottom = this.state.list.slice(index, this.state.list.length)
    bottom.shift()
    this.setState({list: _.union(top, bottom)}, this.update)
  },
  render () {
    return (
      <ul className='list-group'>
        { this.state.list.map((item, i) => {
          return <li key={ Math.random().toString().split('.')[1] } className='list-group-item'>
              <button onClick={ this.move.bind(null, i, -1) } >&uarr;</button>
              <button onClick={ this.move.bind(null, i, 1) } >&darr;</button>
              { item }
              <button onClick={ this.remove.bind(null, i) } className='pull-right'>X</button>
            </li>
        })}
        <div className='input-group'>
          <input className='form-control' type='text' placeholder='Add an Item' ref='addItem'/>
          <span className='input-group-addon' onClick={ this.addItem }>+</span>
        </div>
      </ul>
    )
  }
})
