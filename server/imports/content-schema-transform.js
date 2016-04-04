export function mergeSchema (content = {}, schema = {}) {
  return mergeLayer(content, schema)
}

function mergeLayer (content, schema) {
  var isArray = content instanceof Array
  return Object.keys(content).reduce((merged, key) => {
    let val = content[key]
    let schemaKey = isArray ? schema.itemSchema : (schema[key] || {})
    if (val instanceof Object && schemaKey.type === 'collection') {
      merged[key] = { value: mergeLayer(val, schemaKey), schema: schemaKey }
    } else {
      merged[key] = { value: val, schema: schemaKey }
    }
    return merged
  }, isArray ? [] : {})
}

export function extractContent (merged = {}) {
  return extractContentLayer(merged)
}

function extractContentLayer(merged) {
  if (!merged || !merged.value) return
  return Object.keys(merged.value).reduce((content, key) => {
    content[key] = extractContentLayer(merged.value[key])
    return content
  }, (merged instanceof Array) ? [] : {})
}
