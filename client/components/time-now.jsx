import React from 'react'
import moment from 'moment'

export const TimeNow = React.createClass({
  render () {
    var time = new moment().format('hh:mm:ss')
    return (
      <div>The time now is {time}</div>
    )
  }
})
