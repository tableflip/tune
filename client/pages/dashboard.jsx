import React from 'react'
import { TimeNow } from '../components/time-now'

var ListItem = React.createClass({
  propTypes: {
    item: React.PropTypes.object.isRequired
  },

  render () {
    return (
      <li>{this.props.item.text}</li>
    )
  }
})

export default React.createClass({
  mixins: [ReactMeteorData],

  componentWillMount () {
  },

  componentWillUnmount () {
  },

  getMeteorData () {
    var itemSub = Meteor.subscribe('items')
    return {
      itemsReady: itemSub.ready(),
      items: Items.find({}).fetch()
    }
  },

  render () {
    return (
      <div>
        <h1>This is the dashboard</h1>
        <TimeNow />
        <ul className='list-group'>
          {this.data.items.map(item => (<ListItem item={item} key={item._id} />))}
          <li className='list-group-ltem'><a href="/">Home</a></li>
          <li className='list-group-ltem'><a href="/page/home/edit/type">Edit</a></li>
        </ul>

      </div>
    )
  }
})
