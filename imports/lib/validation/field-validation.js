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
  url: {
    type: 'string',
    pattern: '^(https?://)?([0-9a-z.-]+).([a-z.]{2,6})([/[0-9][a-z].-]*)*/?$'
  },
  email: {
    type: 'string',
    // from https://github.com/sindresorhus/email-regex/blob/master/index.js
    pattern: '^[^\\.\\s@][^\\s@]*(?!\\.)@[^\\.\\s@]+(?:\\.[^\\.\\s@]+)*$'
  }
}
