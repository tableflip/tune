import React from 'react'

export default React.createClass({
  propTypes: {
    content: React.PropTypes.string,
    parentState: React.PropTypes.func
  },
  getInitialState: function () {
    return {
      src: this.props.content
    }
  },
  update: function () {
    this.props.parentState(this.refs.img.src)
  },
  uploadcare: function (e) {
    e.preventDefault()
    let self = this
    let opts = {
      crop: 'free',
      imagesOnly: true
    }
    uploadcare.openDialog(null, opts).done((file) => {
      file.done((info) => {
        self.setState({src: info.cdnUrl}, self.update)
      })
    })
  },
  render () {
    return (
      <div>
        <img src={ this.state.src } width='100%' onClick={ this.uploadcare } ref='img'/>
      </div>
    )
  }
})
