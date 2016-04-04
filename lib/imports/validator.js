import validator from 'jsen'
import * as objectPath from 'object-path'
import fieldValidation from './field-validation'

export function validateDocField({ doc, fieldPath, newValue }) {
  var data = doc.content || doc.facts
  if (!data) throw new Meteor.Error('No valid data in document')
  var docKey = objectPath.get(doc, `content.json.${fieldPath}`)
  var schemaVal = {
    type: 'string',
    required: true
  }
  if (docKey.schema) {
    Object.assign(schemaVal, fieldValidation[docKey.schema.type] || {})
    Object.assign(schemaVal, docKey.schema.validation || {})
  }
  var miniSchema = {
    required: true,
    type: 'object',
    properties: { [fieldPath]: schemaVal },
    additionalProperties: false
  }
  var validate = validator(miniSchema)
  var valid = validate({ [fieldPath]: newValue })
  if (!valid) return { error: validationError(validate.errors[0].keyword) }
  return { value: newValue }
}

export function validateField ({ schema, val }) {
  var schemaVal = {
    type: 'string',
    required: true
  }
  if (schema) {
    Object.assign(schemaVal, fieldValidation[schema.type] || {})
    Object.assign(schemaVal, schema.validation || {})
  }
  var miniSchema = {
    required: true,
    type: 'object',
    properties: { value: schemaVal },
    additionalProperties: false
  }
  var validate = validator(miniSchema)
  var valid = validate({ value: val })
  if (!valid) return { error: validationError(validate.errors[0].keyword) }
  return { value: val }
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
