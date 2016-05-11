import React from 'react'
import moment from 'moment'
import { Meteor } from 'meteor/meteor'

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
