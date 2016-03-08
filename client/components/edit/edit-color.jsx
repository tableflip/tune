import React from 'react'
import ColorPicker from 'react-color'

export default React.createClass({
  propTypes: {
    content: React.PropTypes.string,
    parentState: React.PropTypes.func
  },
  getInitialState: function () {
    return {
      color: this.props.content
    }
  },
  update: function () {
    this.props.parentState(this.state.color)
  },
  changeColor: function (colorData) {
    let newColor = '#' + colorData.hex
    this.setState({color: newColor}, this.update())
  },
  render () {
    return (
      <div className='card'>
        <div className='card-header' style={ {background: this.props.content} }>Old Color</div>
        <div className='card-header' style={ {background: this.state.color} }>New Color</div>
        <div className='card-block'>
          <ColorPicker type='chrome' color={ this.state.color } onChange={ this.changeColor } />
        </div>
      </div>
    )
  }
})
