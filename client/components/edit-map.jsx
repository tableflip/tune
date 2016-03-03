import React from 'react'

export default React.createClass({
  propTypes: {
    content: React.PropTypes.array,
    parentState: React.PropTypes.func
  },
  componentDidMount: function () {
    const map = L.map('map')
    L.tileLayer('https://api.mapbox.com/styles/v1/bmordan/cilb8yhdi00eibgm0mijm154d.html?title=true&access_token=pk.eyJ1IjoiYm1vcmRhbiIsImEiOiJvOHdmZ1pBIn0.SDHTHU1sNNTJRCgs4lfAEg#13/51.505/-0.090', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18
    }).addTo(map)
  },
  render () {
    const mapPane = {
      width: '100%',
      height: '340px'
    }
    return (
      <div id='map' style={ mapPane }></div>
    )
  }
})
