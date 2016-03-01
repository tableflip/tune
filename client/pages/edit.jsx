import React from 'react'
import { Field } from '../components/editable-fields'

export default React.createClass({
  render () {
    return (
      <div>
        <Field type='textarea' value='button love' elementId='boo'/>
        <Field type='img' value='http://s3.amazonaws.com/dogfish-uploads/uploadcare/f5840aac-f875-4a08-8116-3cf6e53db1a3/bg.png'/>
      </div>
    )
  }
})
