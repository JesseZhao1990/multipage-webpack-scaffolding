const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const webpack = require('webpack')
const paths = require('./paths')
const { discoverPages } = require('./pages')

function styleLoaders(preProcessor) {
  return [
    MiniCssExtractPlugin.loader,
    { loader: 'css-loader', options: { importLoaders: preProcessor ? 2 : 1 } },
    'postcss-loader',
    preProcessor
  ].filter(Boolean)
}

module.exports = function createCommonConfig({ production = false } = {}) {
  const pages = discoverPages()
  const entry = Object.fromEntries(pages.map(page => [page.name, page.script]))

  return {
    entry,
    output: {
      path: paths.dist,
      filename: 'static/js/[name].[contenthash:8].js',
      assetModuleFilename: 'static/assets/[name].[contenthash:8][ext][query]',
      publicPath: 'auto',
      clean: true
    },
    resolve: {
      extensions: ['.js', '.json'],
      alias: {
        '@': paths.src
      }
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: paths.src,
          use: 'babel-loader'
        },
        {
          test: /\.html$/,
          include: paths.src,
          loader: 'html-loader',
          options: { sources: true }
        },
        {
          test: /\.ejs$/,
          include: paths.src,
          loader: 'ejs-loader',
          options: {
            esModule: false,
            variable: 'data'
          }
        },
        {
          test: /\.css$/i,
          use: styleLoaders()
        },
        {
          test: /\.less$/i,
          use: styleLoaders('less-loader')
        },
        {
          test: /\.(png|jpe?g|gif|svg|webp|avif)$/i,
          type: 'asset',
          parser: { dataUrlCondition: { maxSize: 8 * 1024 } },
          generator: { filename: 'static/img/[name].[contenthash:8][ext]' }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: { filename: 'static/fonts/[name].[contenthash:8][ext]' }
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/i,
          type: 'asset/resource',
          generator: { filename: 'static/media/[name].[contenthash:8][ext]' }
        }
      ]
    },
    plugins: [
      new webpack.ProvidePlugin({ _: 'lodash' }),
      new ESLintPlugin({ context: paths.src, extensions: ['js'] }),
      new MiniCssExtractPlugin({ filename: 'static/css/[name].[contenthash:8].css' }),
      ...pages.map(page => new HtmlWebpackPlugin({
        filename: `${page.name}.html`,
        template: page.template,
        chunks: [page.name],
        inject: 'body',
        scriptLoading: 'defer',
        minify: production
      }))
    ],
    optimization: {
      runtimeChunk: 'single',
      splitChunks: { chunks: 'all' }
    },
    performance: { hints: production ? 'warning' : false },
    stats: 'errors-warnings'
  }
}
