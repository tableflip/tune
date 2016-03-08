Package.describe({
  summary: 'Build plugin for sass and scss',
  version: '3.4.2_1',
  git: 'https://github.com/tableflip/meteor-sass.git',
  name: 'tableflip:sass'
})

Package.registerBuildPlugin({
  name: 'compileSass',
  use: ['caching-compiler', 'ecmascript'],
  sources: [ 'compile.js' ],
  npmDependencies: {
    'node-sass': '3.4.2'
  }
})

Package.onUse(function (api) {
  api.versionsFrom('1.2.0.2')
  api.use('isobuild:compiler-plugin@1.0.0')
})
