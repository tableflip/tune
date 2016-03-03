import React from 'react'
import fields from '../lib/field-lookup'

export default React.createClass({
  propTypes: {
    page: React.PropTypes.string,
    key: React.PropTypes.string
  },
  getInitialState: () => {
    return null
  },
  updateState: function (value) {
    this.setState({payload: value})
  },
  componentDidMount () {
    Meteor.call('getField', this.props.page, this.props.key, (err, response) => {
      if (err) return console.error(err)
      this.setState(response)
    })
  },
  save: function (e) {
    e.preventDefault()
    console.log(this.state.payload)
  },
  render () {
    if (!this.state) return (<div>Fetching your content ...</div>)
    let field = fields(this.state.type, this.state.content, this.updateState)
    return (
      <form>
        <fieldset className='form-group'>
          { field }
        </fieldset>
        <fieldset className='form-group'>
          <button onClick={ this.save } className='btn btn-primary'>Save</button>
        </fieldset>
      </form>
    )
  }
})
