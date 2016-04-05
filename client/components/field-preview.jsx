import React from 'react'

export default React.createClass({
  propTypes: {
    schema: React.PropTypes.any,
    value: React.PropTypes.any
  },
  render () {
    if (this.props.schema instanceof Array) return (<CollectionPreview collection={this.props.value} schema={this.props.schema[0]} />)
    let type = this.props.schema && this.props.schema.type
    switch (type) {
      case 'img':
      return (<ImagePreview url={this.props.value} />)

      case 'map':
      return (<MapPreview center={this.props.value} />)

      case 'color':
      return (<ColorPreview color={this.props.value} />)

      case 'list':
      return (<ListPreview list={this.props.value} />)

      default:
      return (<div>{this.props.value}</div>)
    }
  }
})

let ImagePreview = React.createClass({
  render() {
    let style = {
      borderRadius: '5px',
      border: '2px solid #444',
      height: '70px'
    }
    return (
      <img src={this.props.url} style={style} />
    )
  }
})

let MapPreview = React.createClass({
  render() {
    let style = {
      borderRadius: '5px',
      border: '2px solid #444',
    }
    let accessToken = Meteor.settings && Meteor.settings.public && Meteor.settings.public.mapbox && Meteor.settings.public.mapbox.accessToken
    let center = `${this.props.center[1]},${this.props.center[0]}`
    return (
      <img style={style} src={`https://api.mapbox.com/v4/mapbox.outdoors/${center},12/150x100.png?access_token=${accessToken}`} />
    )
  }
})

let ColorPreview = React.createClass({
  render() {
    let style = {
      borderRadius: '5px',
      border: '2px solid #444',
      backgroundColor: this.props.color,
      width: '100px',
      height: '70px'
    }
    return (
      <div style={style}></div>
    )
  }
})

let ListPreview = React.createClass({
  render () {
    return (
      <div>
        {this.props.list.map((entry, i) => (<div key={i}>{entry}</div>))}
      </div>
    )
  }
})

let CollectionPreview = React.createClass({
  render () {
    let headlineField = Object.keys(this.props.schema).find(key => {
      var schemaKey = this.props.schema[key]
      return schemaKey && schemaKey.type === 'text'
    }) || Object.keys(this.props.schema)[0]
    return (
      <ul className="list-group">
        {this.props.collection.map((entry, ind) => (
          <li className="list-group-item" key={ind}><span className="text-muted">{headlineField}:</span> {entry[headlineField]}</li>
        ))}
      </ul>
    )
  }
})
