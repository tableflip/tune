export function mergeSchema (content = {}, schema = {}) {
  return mergeLayer(content, schema)
}

function mergeLayer (content, schema) {
  return Object.keys(content).reduce((merged, key) => {
    let val = content[key]
    let schemaKey = schema.type === 'collection' ? schema.itemSchema : (schema[key] || {})
    if (val instanceof Object && (!schemaKey.type || schemaKey.type === 'collection')) {
      merged[key] = mergeLayer(val, schemaKey)
    } else {
      merged[key] = { value: val, schema: schemaKey }
    }
    return merged
  }, (content instanceof Array) ? [] : {})
}

export function extractContent (merged = {}) {
  return extractContentLayer(merged)
}

function extractContentLayer(merged) {
  if (!merged) return
  if (merged.value) return merged.value
  return Object.keys(merged).reduce((content, key) => {
    content[key] = extractContentLayer(merged[key])
    return content
  }, (merged instanceof Array) ? [] : {})
}
