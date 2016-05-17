import React from 'react'
import jsen from 'jsen'
import { browserHistory } from 'react-router'
import getPrimaryField from '/imports/lib/validation/get-primary-field'

let EditCollection = React.createClass({
  propTypes: {
    projectId: React.PropTypes.string,
    pageId: React.PropTypes.string,
    field: React.PropTypes.string,
    schema: React.PropTypes.any,
    content: React.PropTypes.array,
    update: React.PropTypes.func
  },
  getInitialState: function () {
    return { list: this.props.content, lastMoved: -1, lastDir: 0, listLength: this.props.content.length }
  },
  componentDidMount: function () {
    this.update()
  },
  update: function () {
    this.props.update(this.state.list)
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
    let newList = this.state.list
    var defaultBuilder = jsen({ default: {}, properties: this.props.schema[0] })
    newList.push(defaultBuilder.build())
    this.setState({ list: newList, lastMoved: newList.length - 1, lastDir: -1 }, this.update)
  },
  storeButton (index, dir) {
    return (index === this.state.lastMoved && dir === this.state.lastDir)
      ? (button) => { this._focusButton = button }
      : () => {}
  },
  saveAndFollowLink (link, e) {
    this.props.save(e, () => {
      browserHistory.push(link)
    })
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
    let schema = this.props.schema[0]
    let primaryField = getPrimaryField(schema)
    return (
      <ul className='list-group' onKeyDown={this.refocus}>
        {this.state.list.length
            ? this.state.list.map((item, i) => {
              const editLink = `/project/${this.props.projectId}/page/${this.props.pageId}/collection/${this.props.field}/${i.toString()}`
              return (
                <li key={i} className='list-group-item'>
                  <div className='row'>
                    <div className='col-xs-12'>
                      <div className='btn-group m-r-1' role='group'>
                        <button type='button' className='btn btn-secondary' onClick={this.move.bind(null, i, -1)} ref={this.storeButton(i, -1)}>
                          <i className='fa fa-arrow-up'></i>
                        </button>
                        <button type='button' className='btn btn-secondary' onClick={this.move.bind(null, i, 1)} ref={this.storeButton(i, 1)}>
                          <i className='fa fa-arrow-down'></i>
                        </button>
                      </div>
                      <button className='pull-right btn btn-primary' onClick={this.saveAndFollowLink.bind(null, editLink)}>Edit</button>
                    </div>
                    <div className='col-xs-12'>
                      <div className='m-t-1'>{item[primaryField]}</div>
                    </div>
                  </div>
                </li>
              )
            })
          : (<li className='list-group-item text-xs-center text-muted'>No entries</li>)
        }
        <li className='list-group-item text-xs-center'>
          <button className='btn btn-secondary' onClick={this.addItem}><i className='fa fa-plus'></i> Add an item</button>
        </li>
      </ul>
    )
  },
  componentDidUpdate () {
    this._focusButton && this._focusButton.focus() && this._focusButton.select()
  }
})

export default EditCollection
