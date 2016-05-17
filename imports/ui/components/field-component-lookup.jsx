import React from 'react'
import * as Components from './edit'

export default function (props) {
  let type = getType(props.schema)
  let Component = Components[type]
  return (<Component {...props} />)
}

function getType (schema) {
  if (schema instanceof Array) return 'collection'
  return (schema && schema.type) || 'text'
}
