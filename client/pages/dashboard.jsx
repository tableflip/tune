import React from 'react'
import { TimeNow } from '../components/time-now'
import { Navbar } from '../components/navbar'

var ListItem = React.createClass({
  propTypes: {
    item: React.PropTypes.object.isRequired
  },

  render () {
    return (
      <li className="list-group-item">{this.props.item.text}</li>
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
        <Navbar pagename="dashboard" />
        <div className="container-fluid">

          <div className="row">
            <div className="col-md-2">
              <div className="card m-t-2">
                <div className="card-block"><TimeNow /></div>
                <ul className='list-group list-group-flush'>
                  {this.data.items.map(item => (<ListItem className="list-group-item" item={item} key={item._id} />))}
                  <li className='list-group-item'><a href="/">Home</a></li>
                  <li className='list-group-item'><a href="/page/home/edit/type">Edit</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})
