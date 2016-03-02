import React from 'react'
import fields from '../lib/field-lookup'

export default React.createClass({
  getInitialState: () => {
    return null
  },
  updateState: function (value) {
    this.setState({payload: value})
  },
  componentDidMount () {
    let page = FlowRouter.getParam('page')
    let key = FlowRouter.getParam('key')
    Meteor.call('getField', page, key, (err, response) => {
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
