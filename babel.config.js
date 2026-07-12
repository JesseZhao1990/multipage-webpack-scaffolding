module.exports = {
  presets: [
    ['@babel/preset-env', {
      bugfixes: true,
      corejs: '3.41',
      modules: false,
      useBuiltIns: 'usage'
    }]
  ]
}
