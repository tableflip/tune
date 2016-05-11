import React from 'react'
import ReactLoader from 'react-loader'

// http://fgnass.github.io/spin.js/#?lines=9&length=0&width=5&radius=15&scale=1.00&corners=1.0&opacity=0.05&rotate=55&direction=1&speed=1.0&trail=80&top=50&left=50&hwaccel=on
const options = {
  lines: 9, // The number of lines to draw
  length: 0, // The length of each line
  width: 5, // The line thickness
  radius: 12, // The radius of the inner circle
  scale: 1, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  color: '#fff', // #rgb or #rrggbb or array of colors
  opacity: 0.05, // Opacity of the lines
  rotate: 55, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  speed: 1, // Rounds per second
  trail: 80, // Afterglow percentage
  fps: 20, // Frames per second when using setTimeout() as a fallback for CSS
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  className: 'spinner', // The CSS class to assign to the spinner
  top: '-39px', // Top position relative to parent
  left: '30px', // Left position relative to parent
  shadow: false, // Whether to render a shadow
  hwaccel: true, // Whether to use hardware acceleration
  position: 'absolute' // Element positioning
}

export default React.createClass({
  render () {
    return <ReactLoader options={options} {...this.props} />
  }
})
