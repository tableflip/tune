import validator from 'jsen'
import { get as getObjectPath } from 'object-path'
import fieldValidation from './field-validation'

export const collectionKeyRegex = /([^\.]+)\.(\d+)\.([^\.]+)/

export function validateDocField({ doc, field, newValue }) {
  field = field.replace(collectionKeyRegex, (match, p1, p2, p3, offset, string) => {
    if (match) return `${p1}.0.${p3}`
    return string
  })
  console.log('Field is', field)
  var data = doc.content
  if (!data) throw new Meteor.Error('No valid data in document')
  var docSchemaKey = getObjectPath(doc.schema, field)
  if (docSchemaKey && docSchemaKey instanceof Array) return validateCollection(docSchemaKey[0], newValue)
  var schemaVal = {
    type: 'string',
    required: true
  }
  if (docSchemaKey) {
    Object.assign(schemaVal, fieldValidation[docSchemaKey.type] || {})
    Object.assign(schemaVal, docSchemaKey.validation || {})
  }
  var miniSchema = {
    required: true,
    type: 'object',
    properties: { [field]: schemaVal },
    additionalProperties: false
  }
  var validate = validator(miniSchema)
  var valid = validate({ [field]: newValue })
  if (!valid) return { error: validationError(validate.errors[0].keyword) }
  return { value: newValue }
}

function validateCollection (schema, collection) {
  var validate = validator(schema)
  var errors = collection.reduce((errors, item, index) => {
    var valid = validate(item)
    if (!valid) errors.push({ index: index, error: validationError(validate.errors[0].keyword) })
    return errors
  }, [])
  if (errors.length) return { error: errors }
  return { value: collection }
}

function validationError(keyword) {
  switch (keyword) {
    case 'maxLength':
      return 'The value is too long'

    case 'minLength':
      return 'The value is not long enough'

    default:
      return 'This value is not valid'
  }
}
