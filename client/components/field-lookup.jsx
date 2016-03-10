import React from 'react'
import TextField from './edit/edit-text'
import Textarea from './edit/edit-textarea'
import UnorderedList from './edit/edit-list'
import SingleImage from './edit/edit-img'
import Map from './edit/edit-map'
import ColorPicker from './edit/edit-color'

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
