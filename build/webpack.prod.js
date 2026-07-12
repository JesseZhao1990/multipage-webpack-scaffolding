const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const createCommonConfig = require('./webpack.common')

const config = createCommonConfig({ production: true })

module.exports = {
  ...config,
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    ...config.optimization,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()]
  }
}
