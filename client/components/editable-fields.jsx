import React from 'react'
import Markdown from 'markdown-it'

const ActionButtons = React.createClass({
  propTypes: {
    ctx: React.PropTypes.object
  },
  preview: function (e) {
    e.preventDefault()
    console.log(this.props.ctx)
  },
  publish: function (e) {
    e.preventDefault()
    console.log(this.props.ctx)
  },
  render () {
    return (
      <fieldset>
        <button onClick={ this.preview }>Preview</button>
        <button onClick={ this.publish }>Publish</button>
      </fieldset>
    )
  }
})

export const Field = React.createClass({
  propTypes: {
    type: React.PropTypes.string,
    value: React.PropTypes.string,
    elementId: React.PropTypes.string
  },
  uploadImage: function (e) {
    let opts = {
      imagesOnly: true,
      multiple: false
    }
    uploadcare.openDialog(null, opts).done(function (file) {
      file.promise().done(function (fileInfo) {
        console.log(fileInfo.cdnUrl)
      })
    })
  },
  render () {
    switch (this.props.type) {
      case 'textarea':
        return (
          <form>
            <fieldset>
              <textarea ref={ this.props.elementId } id={ this.props.elementId } defaultValue={ this.props.value || 'no content' }></textarea>
            </fieldset>
            <ActionButtons ctx={ this }/>
          </form>
        )
      case 'img':
        return (
          <form>
            <input type='hidden' role='uploadcare-uploader' data-images-only='true' data-multiple='true' />
            <img ref={ this.props.elementId } id={ this.props.elementId } src={ this.props.value } width='100%' onClick={ this.uploadImage }/>
            <ActionButtons ctx={ this }/>
          </form>
        )
      default:
        return (
          <form>
            <input ref={ this.props.elementId } id={ this.props.elementId } type='text' defaultValue={ this.props.value || 'no content' }/>
            <ActionButtons ctx={ this }/>
          </form>
        )
    }
  }
})
