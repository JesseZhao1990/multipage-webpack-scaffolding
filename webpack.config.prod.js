/* eslint-disable */
const webpack = require('webpack');  
const path = require('path')  
const HtmlWebpackPlugin = require('html-webpack-plugin');  
const ExtractTextPlugin = require("extract-text-webpack-plugin");  
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const pageConfig = require('./page.config.js');

class ChunksFromEntryPlugin {
  apply (compiler) {
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

let webpackConfig = {
  mode: 'production',
  // 配置入口  
  entry: {},
  devtool: "source-map",
  // 配置出口  
  output: {
    path: path.join(__dirname, "./dist/"),  
    filename: 'static/js/[name].[hash:7].js',  
    publicPath: '/',  
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [path.join(__dirname, "./src")],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      // html中的img标签
      {
        test: /\.html$/,
        loader:'html-withimg-loader',
        include: [path.join(__dirname, "./src")],
        options: {
          limit: 10000,
          // min:false,
          min:true,
          name: 'static/img/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [path.join(__dirname, "./src")]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/img/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/fonts/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader'],
        }),
      },      
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader'],
        }),
      },
    ]
  },
  plugins:[
    new UglifyJsPlugin({
      sourceMap:true,
      parallel: true
    }),
    new ExtractTextPlugin({
     filename: 'static/css/[name].[hash:7].css'
    }),
    //设置每一次build之前先删除dist  
    new CleanWebpackPlugin(  
      ['dist/*',],　     //匹配删除的文件  
      {  
          root: __dirname,   //根目录  
          verbose: true,    //开启在控制台输出信息  
          dry: false     //启用删除文件  
      }  
    ),
    new ChunksFromEntryPlugin(),
  ],
  optimization:{
    splitChunks: {
      chunks: "all",
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
          vendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10
          },
          // default: {
          //     minChunks: 2,
          //     priority: -20,
          //     reuseExistingChunk: true
          // },
          commons: {
            name: "commons",
            chunks: "initial",
            minChunks: 2
          }
      }
    }
  }
};

if(pageConfig && Array.isArray(pageConfig)){
  pageConfig.map(page => {
    webpackConfig.entry[page.name] = `./src/pages/${page.jsEntry}`;
    webpackConfig.plugins.push(new HtmlWebpackPlugin({
      filename: path.join(__dirname,`/dist/${page.name}.html`),
      template: path.join(__dirname,`/src/pages/${page.html}`),
      inject: true,
      entry: page.name,
      chunks: [page.name],  
      inlineSource: '.(js|css)$',
      // minify:false,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      chunksSortMode: 'dependency'
    }))
  })
}

module.exports = webpackConfig;