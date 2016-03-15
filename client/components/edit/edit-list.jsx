import React from 'react'

export default React.createClass({
  propTypes: {
    content: React.PropTypes.array,
    parentState: React.PropTypes.func
  },
  getInitialState: function () {
    return { list: this.props.content, lastMoved: -1, lastDir: 0 }
  },
  componentDidMount: function () {
    this.update()
  },
  update: function () {
    this.props.parentState(this.state.list)
  },
  move: function (index, dir, e) {
    e.preventDefault()
    let list = Array.from(this.state.list)
    let el = list.splice(index, 1)
    list.splice(Math.max(index + dir, 0), 0, el[0])
    this.setState({ list: list, lastMoved: index + dir, lastDir: dir }, this.update)
  },
  addItem: function (e) {
    e.preventDefault()
    if (this.refs.addItem.value === '') return
    let newList = this.state.list
    newList.push(this.refs.addItem.value)
    this.refs.addItem.value = ''
    this.setState({ list: newList, lastMoved: newList.length - 1, lastDir: -1 }, this.update)
  },
  remove: function (index, e) {
    e.preventDefault()
    let top = this.state.list.slice(0, index)
    let bottom = this.state.list.slice(index, this.state.list.length)
    bottom.shift()
    this.setState({list: _.union(top, bottom)}, this.update)
  },
  storeButton (index, dir) {
    return (index === this.state.lastMoved && dir === this.state.lastDir) ?
      button => this._focusButton = button :
      () => {}
  },
  refocus (e) {
    switch (e.keyCode) {
      case 37:
      case 39:
      this.setState({ lastDir: this.state.lastDir * -1 })
      return

      case 38:
      this.setState({ lastMoved: (this.state.lastMoved - 1) % this.state.list.length })
      return

      case 40:
      this.setState({ lastMoved: (this.state.lastMoved + 1) % this.state.list.length })
      return
    }
  },
  render () {
    return (
      <ul className='list-group' onKeyDown={this.refocus}>
        { this.state.list.map((item, i) => {
          return <li key={i} className='list-group-item'>
              <div className="btn-group m-r-1" role="group">
                <button type="button" className="btn btn-secondary" onClick={ this.move.bind(null, i, -1) } ref={this.storeButton(i, -1)}>
                  <i className="fa fa-arrow-up"></i>
                </button>
                <button type="button" className="btn btn-secondary" onClick={ this.move.bind(null, i, 1) } ref={this.storeButton(i, 1)}>
                  <i className="fa fa-arrow-down"></i>
                </button>
              </div>
              { item }
              <button  className='pull-right btn btn-danger' onClick={ this.remove.bind(null, i) }><i className="fa fa-remove"></i></button>
            </li>
        })}
        <li className="list-group-item">
          <form onSubmit={ this.addItem }>
            <div className="form-group row m-y-0">
              <div className="col-xs-10">
                <input className='form-control' type='text' placeholder='Add an Item' ref='addItem' />
              </div>
              <div className="col-xs-2 text-right">
                <span className='pull-right btn btn-primary' onClick={ this.addItem }><i className="fa fa-plus"></i></span>
              </div>
            </div>
          </form>
        </li>
      </ul>
    )
  },
  componentDidUpdate () {
    this._focusButton && this._focusButton.focus()
  }
})
