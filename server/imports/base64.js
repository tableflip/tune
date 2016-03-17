export default {
  encode: (json) => new Buffer(JSON.stringify(json, null, 2)).toString('base64'),
  decode: (data) => new Buffer(data, 'base64').toString('utf8')
}
