import React from 'react'
import Helmet from 'react-helmet'
import { Meteor } from 'meteor/meteor'

const UploadcareInner = React.createClass({
  propTypes: {
    content: React.PropTypes.string,
    update: React.PropTypes.func,
    save: React.PropTypes.func
  },
  getInitialState: function () {
    return {
      src: this.props.content
    }
  },
  componentDidMount: function () {
    this.update()
  },
  update: function () {
    this.props.update(this.refs.img.src)
  },
  uploadcare: function (e) {
    e.preventDefault()
    let self = this
    let opts = {
      crop: 'free',
      imagesOnly: true
    }
    window.uploadcare.openDialog(null, opts).done((file) => {
      file.done((info) => {
        self.setState({src: info.cdnUrl}, self.update)
      })
    })
  },
  onError () {
    this.setState({ src: '/placeholder.png' })
  },
  render () {
    return (
      <div>
        <img src={this.state.src} width='100%' onClick={this.uploadcare} onError={this.onError} ref='img' />
      </div>
    )
  }
})

export default React.createClass({
  render () {
    return (
      <div>
        <Helmet
          script={[
            { type: 'text/javascript', innerHTML: `
              window.UPLOADCARE_PUBLIC_KEY = '${Meteor.settings.public.uploadcare.publicKey}';
              UPLOADCARE_LOCALE = "en";
              UPLOADCARE_TABS = "file url facebook gdrive dropbox instagram";
            ` },
            { type: 'text/javascript', src: 'https://ucarecdn.com/widget/2.8.2/uploadcare/uploadcare.full.min.js' }
          ]}
        />
        <UploadcareInner {...this.props} />
      </div>
    )
  }
})
