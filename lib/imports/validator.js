import validator from 'is-my-json-valid'
import fieldValidation from './field-validation'

export function validateDocField({ doc, field, newValue }) {
  var data = doc.content || doc.facts
  if (!data) throw new Meteor.Error('No valid data in document')
  var docSchemaKey = doc.schema[field]
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
  if (!valid) return {
    message: `${validate.errors[0].field} ${validate.errors[0].message}`
  }
}
