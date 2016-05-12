// This takes a schema and should return a primary field from it for summary purposes
export default function (schema) {
  return Object.keys(schema).find(key => {
    var schemaKey = schema[key]
    return schemaKey && schemaKey.type === 'text'
  }) || Object.keys(schema)[0]
}
