import React from 'react'
import * as Components from './edit'

module.exports = function (type, content, update, save) {
  let Component = Components[`${type}`]
  let props = { content, update, save }
  return (<Component {...props} />)
}
