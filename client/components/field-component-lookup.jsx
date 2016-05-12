import React from 'react'
import * as Components from './edit'

export default function ({ field, schema, content, update, save }) {
  let type = getType(schema)
  let Component = Components[type]
  let props = { field, schema, content, update, save }
  return (<Component {...props} />)
}

function getType(schema) {
  if (schema instanceof Array) return 'collection'
  return (schema && schema.type) || 'text'
}
