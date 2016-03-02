import React from 'react'
import TextField from '../components/edit-text'
import Textarea from '../components/edit-textarea'
import UnorderedList from '../components/edit-list'

const components = {
  text: (content, submitHandler) => (<TextField content={ content } submitHandler={ submitHandler }/>),
  textarea: (content, submitHandler) => (<Textarea content={ content } submitHandler={ submitHandler }/>),
  list: (content, submitHandler) => (<UnorderedList content={ content } submitHandler={ submitHandler }/>)
}

module.exports = function (type, content, submitHandler) {
  return components[type](content, submitHandler)
}
