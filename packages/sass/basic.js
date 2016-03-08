const path = Plugin.path;
const sass = Npm.require('node-sass');

Plugin.registerCompiler({
  extensions: ['sass', 'scss'],
  archMatching: 'web'
}, () => new SassCompiler())

class SassCompiler {
  processFilesForTarget(files) {
    files
      .filter((f) => f.getBasename().indexOf('_') !== 0)
      .forEach((f) => {
        console.log(f.getPathInPackage())
        // sass.render({
        //   data: f.getContentsAsString(),
        //   file: f.getPathInPackage(),
        //   indentedSyntax: f.getExtension() === 'sass',
        //   importer: (url, prev, done) => {
        //     console.log('importer', url, prev)
        //     done({content:''})
        //   }
        // }, (err, res) => {
        //   f.addStylesheet({data: res.css, file: f.getPathInPackage()})
        // })
      }
  }
}
// JadeCompiler.prototype.processFilesForTarget = function (files) {
//   files.forEach(function (file) {
//     // process and add the output
//     var output = compileJade(file.getContentsAsString());
//     file.addJavaScript({ data: output, path: file.getPathInPackage() + '.js' });
//   });
// };
