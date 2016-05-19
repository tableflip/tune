import React from 'react'

export default React.createClass({
  propTypes: {
    content: React.PropTypes.bool,
    update: React.PropTypes.func,
    save: React.PropTypes.func
  },
  save () {
    this.props.save(this.radioTrue.checked)
  },
  update () {
    this.props.update(this.radioTrue.checked)
  },
  render () {
    return (
      <form onSubmit={this.save}>
        <label className='radio-inline'>
          <input type='radio' name='bool' ref={(r) => this.radioTrue = r} defaultChecked={this.props.content} onChange={this.update} /> Yes
        </label>
        <label className='radio-inline'>
          <input type='radio' name='bool' defaultChecked={!this.props.content} onChange={this.update} /> No
        </label>
      </form>
    )
  }
})
