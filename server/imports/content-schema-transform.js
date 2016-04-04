export function mergeSchema (content = {}, schema = {}) {
  return mergeLayer(content, schema)
}

function mergeLayer (content, schema) {
  var isArray = content instanceof Array
  return Object.keys(content).reduce((merged, key) => {
    let val = content[key]
    let schemaKey = isArray ? (schema.itemSchema || { type: 'text' }) : (schema[key] || {})
    if (schemaKey.type === 'collection') {
      merged.value[key] = mergeLayer(val, schemaKey)
    } else if (['map', 'list'].indexOf(schemaKey.type) > -1) {
      merged.value[key] = { value: val, schema: schemaKey }
    } else if (val instanceof Object) {
      merged.value[key] = { value: mergeLayer(val, schemaKey), schema: { type: val instanceof Array ? 'array' : 'object' } }
    } else {
      merged.value[key] = { value: val, schema: schemaKey }
    }
    return merged
  }, {
    value: isArray ? [] : {},
    schema: schema.type === 'collection' ? schema : { type: isArray ? 'array' : 'object' }
  })
}

export function extractContent (merged = {}) {
  return extractContentLayer(merged)
}

function extractContentLayer(merged) {
  console.log(merged)
  console.log('**********')
  if (!merged || !merged.value) return
  if (!merged.schema) return merged.value
  if (['object', 'array', 'collection'].indexOf(merged.schema.type) === -1) return merged.value
  return Object.keys(merged.value).reduce((content, key) => {
    content[key] = extractContentLayer(merged.value[key])
    return content
  }, (merged.value instanceof Array) ? [] : {})
}
