import React from 'react'

export default React.createClass({
  propTypes: {
    content: React.PropTypes.string,
    update: React.PropTypes.func,
    save: React.PropTypes.func
  },
  update: function (e) {
    this.props.update(this.refs.text.value)
  },
  render () {
    return (
      <form onSubmit={this.props.save}>
        <input type='text' className='form-control' ref='text' defaultValue={this.props.content} onChange={this.update} />
      </form>
    )
  }
})
