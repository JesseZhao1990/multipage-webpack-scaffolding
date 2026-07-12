const createCommonConfig = require('./webpack.common')

module.exports = {
  ...createCommonConfig(),
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    hot: true,
    open: true,
    static: false,
    watchFiles: ['src/pages/**/*']
  }
}
