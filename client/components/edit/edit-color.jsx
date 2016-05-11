import React from 'react'
import ColorPicker from 'react-color'

export default React.createClass({
  propTypes: {
    content: React.PropTypes.string,
    update: React.PropTypes.func,
    save: React.PropTypes.func
  },
  getInitialState: function () {
    return { color: this.props.content }
  },
  changeColor: function (colorData) {
    let newColor = '#' + colorData.hex
    this.setState({color: newColor})
    this.props.update(newColor)
  },
  render () {
    return (
      <div className='card'>
        <div className='card-header' style={{ background: this.props.content }}>Old Color</div>
        <div className='card-header' style={{ background: this.state.color }}>New Color</div>
        <div className='card-block text-xs-center'>
          <div style={{display: 'inline-block'}}>
            <ColorPicker type='sketch' color={this.state.color} onChange={this.changeColor} />
          </div>
        </div>
      </div>
    )
  }
})
