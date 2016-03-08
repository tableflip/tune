const path = Plugin.path;
const sass = Npm.require('node-sass');
const Future = Npm.require('fibers/future');

// - all refs must start with {}

Plugin.registerCompiler({
  extensions: ['sass', 'scss'],
  archMatching: 'web'
}, () => new SassCompiler())

class SassCompiler extends MultiFileCachingCompiler {
  constructor() {
    super({
      compilerName: 'sass',
      defaultCacheSize: 1024*1024*10,
    })
  }

  getCacheKey(inputFile) {
    return inputFile.getSourceHash()
  }

  compileResultSize(compileResult) {
    return compileResult.css.length +
      this.sourceMapSize(compileResult.sourceMap);
  }

  isRoot(inputFile) {
    var filename = inputFile.getBasename()
    return filename.indexOf('_') !== 0
  }

  compileOneFile(inputFile, allFiles) {
    // imports are either app, package, or npm
    console.log(inputFile.getBasename())
    console.log(inputFile.getPathInPackage())

    sass.render({
      data: inputFile.getContentsAsString(),
      file: inputFile.getPathInPackage(),
      indentedSyntax : inputFile.getExtension() === 'sass',
      importer: (url, prev, done) => {
        console.log('importer', url, prev)
        done({content:''})
      }
    })
  }
}

function relativeImport (url, prev) {
  if (url.indexOf('{') === 1) return
}

function appImport () {
  if (url.indexOf('{}') !== 1) return
}

function moduleImport () {
  if (url.indexOf('{') !== 1) return
}
