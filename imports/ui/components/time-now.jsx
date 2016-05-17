import React from 'react'
import { Meteor } from 'meteor/meteor'
import moment from 'moment'

export const TimeNow = React.createClass({
  componentWillMount () {
    this.setState({ time: moment().format('hh:mm:ss') })
  },
  componentDidMount () {
    this.interval = Meteor.setInterval(() => {
      this.setState({ time: moment().format('hh:mm:ss') })
    }, 1000)
  },
  componentWillUnmount () {
    Meteor.clearInterval(this.interval)
  },
  render () {
    return (
      <div>The time now is {this.state.time}</div>
    )
  }
})
