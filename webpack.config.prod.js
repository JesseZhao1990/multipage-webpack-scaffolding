/* eslint-disable */
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpackBaseConfig = require('./webpack.config.base');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const merge = require('webpack-merge');
const utils = require('./utils');

class ChunksFromEntryPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('ChunksFromEntryPlugin', compilation => {
      compilation.hooks.htmlWebpackPluginAlterChunks.tap(
        'ChunksFromEntryPlugin',
        (_, { plugin }) => {
          // takes entry name passed via HTMLWebpackPlugin's options
          const entry = plugin.options.entry;
          const entrypoint = compilation.entrypoints.get(entry);

          return entrypoint.chunks.map(chunk =>
            ({
              names: chunk.name ? [chunk.name] : [],
              files: chunk.files.slice(),
              size: chunk.modulesSize(),
              hash: chunk.hash
            })
          );
        }
      );
    });
  }
}

let prodWebpackConfig = {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new UglifyJsPlugin({
      sourceMap: true,
      parallel: true
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[hash:7].css'
    })
  ],
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all',
  //     minSize: 30000,
  //     minChunks: 1,
  //     maxAsyncRequests: 5,
  //     maxInitialRequests: 3,
  //     automaticNameDelimiter: '~',
  //     name: true,
  //     cacheGroups: {
  //       // vendors: {
  //       //   test: /[\\/]node_modules[\\/]/,
  //       //   priority: -10
  //       // },
  //       // default: {
  //       //     minChunks: 2,
  //       //     priority: -20,
  //       //     reuseExistingChunk: true
  //       // },
  //       // commons: {
  //       //   name: 'commons',
  //       //   chunks: 'initial',
  //       //   minChunks: 2
  //       // }
  //     }
  //   }
  // }
}

prodWebpackConfig = utils.pushHtmlWebpackPlugins(
  merge(webpackBaseConfig, prodWebpackConfig), {
  // html-webpack-plugin options
  minify: {
    removeComments: true,
    collapseWhitespace: true,
    removeAttributeQuotes: true
    // more options:
    // https://github.com/kangax/html-minifier#options-quick-reference
  }
})

prodWebpackConfig.plugins.push(new ChunksFromEntryPlugin())

module.exports = prodWebpackConfig
