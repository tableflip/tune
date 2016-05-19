export default {
  text: {
    type: 'string'
  },
  textarea: {
    type: 'string'
  },
  img: {
    type: 'string',
    format: 'uri'
  },
  map: {
    type: 'array',
    maxItems: 2,
    minItems: 2,
    items: { type: 'number' }
  },
  list: {
    type: 'array'
  },
  color: {
    type: 'string'
  },
  boolean: {
    type: 'boolean'
  }
}
