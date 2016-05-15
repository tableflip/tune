import { Meteor } from 'meteor/meteor'
import validator from 'jsen'
import { get as getObjectPath } from 'object-path'
import fieldValidation from './field-validation'

export const collectionKeyRegex = /([^\.]+)\.(\d+)\.([^\.]+)/

export function schemaKey (key) {
  let keyDetails = collectionKeyRegex.exec(key)
  if (!keyDetails) return key
  return `${keyDetails[1]}.0.${keyDetails[3]}`
}

export function validateDocField ({ doc, field, newValue }) {
  field = schemaKey(field)
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
  var result = { type: docSchemaKey.type || schemaVal.type }
  if (!valid) result.error = validationError(validate.errors[0].keyword)
  else result.value = newValue
  return result
}

function validateCollection (schema, collection) {
  var validate = validator({
    required: true,
    type: 'object',
    properties: schema,
    additionalProperties: false
  })
  var errors = collection.reduce((errors, item, index) => {
    var valid = validate(item)
    if (!valid) errors.push({ index: index, error: validationError(validate.errors[0].keyword) })
    return errors
  }, [])
  if (errors.length) return { error: errors }
  return { value: collection }
}

function validationError (keyword) {
  switch (keyword) {
    case 'maxLength':
      return 'The value is too long'

    case 'minLength':
      return 'The value is not long enough'

    default:
      return 'This value is not valid'
  }
}
