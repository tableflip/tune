import React from 'react'
import { Map, TileLayer, Marker } from 'react-leaflet'
import Helmet from 'react-helmet'

export default React.createClass({
  propTypes: {
    content: React.PropTypes.array,
    update: React.PropTypes.func,
    save: React.PropTypes.func
  },
  getInitialState: function () {
    return {
      position: this.props.content
    }
  },
  changePosition: function (e) {
    if (!e) return
    this.setState({position: [e.latlng.lat, e.latlng.lng]}, this.update)
  },
  update: function () {
    this.props.update(this.state.position)
  },
  componentDidMount: function () {
    this.update()
  },
  render () {
    return (
      <div>
        <Helmet
          link={[
            { rel: 'stylesheet', type: 'text/css', href: 'https://api.mapbox.com/mapbox.js/v2.3.0/mapbox.css' }
          ]}
        />
        <Map center={this.props.content} zoom={13} id='map' onClick={this.changePosition}>
          <TileLayer
            url='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
          <Marker position={this.state.position} />
        </Map>
      </div>
    )
  }
})
