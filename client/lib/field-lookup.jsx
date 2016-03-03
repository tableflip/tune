import React from 'react'
import TextField from '../components/edit-text'
import Textarea from '../components/edit-textarea'
import UnorderedList from '../components/edit-list'
import SingleImage from '../components/edit-image'
import Map from '../components/edit-map'
import ColorPicker from '../components/edit-color'

const components = {
  text: (content, parentState) => (<TextField content={ content } parentState={ parentState }/>),
  textarea: (content, parentState) => (<Textarea content={ content } parentState={ parentState }/>),
  list: (content, parentState) => (<UnorderedList content={ content } parentState={ parentState }/>),
  img: (content, parentState) => (<SingleImage content={ content } parentState={ parentState }/>),
  map: (content, parentState) => (<Map content={ content } parentState={ parentState }/>),
  color: (content, parentState) => (<ColorPicker content={ content } parentState={ parentState }/>)
}

module.exports = function (type, content, parentState) {
  return components[type](content, parentState)
}
