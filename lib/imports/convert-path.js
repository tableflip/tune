export default function (path) {
  return path.replace('.', '.value.').replace('][', '].value[')
}
