import React from 'react'
import { TimeNow } from '../components/time-now'

var ListItem = React.createClass({
  propTypes: {
    item: React.PropTypes.object.isRequired
  },

  render () {
    return (
      <li>{this.props.item.text}</li>
    );
  }
})

export default React.createClass({
  mixins: [ReactMeteorData],

  componentWillMount () {
    this.itemSub = Meteor.subscribe('items')
  },

  componentWillUnmount () {
    this.itemSub.stop()
  },

  getMeteorData () {
    return {
      items: Items.find({}).fetch()
    }
  },

  render () {
    return (
      <div>
        <h1>This is the dashboard</h1>
        <TimeNow />
        <ul>
          {this.data.items.map(item => (<ListItem item={item} key={item._id} />))}
        </ul>
        <a href="/">Home</a>
      </div>
    )
  }
})
