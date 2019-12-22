
const webpackBaseConfig = require('./webpack.config.base');
const merge = require('webpack-merge');
const utils = require('./utils');

module.exports = utils.pushHtmlWebpackPlugins(
	merge(webpackBaseConfig, {
		mode: 'development',
		// 起本地服务
		devServer: {
			contentBase: './dist/',
			historyApiFallback: true,
			inline: true,
			hot: true,
			host: '127.0.0.1',
			before(_, server) {
				server._watch(__dirname + '/src/pages')
			}
		}
	})
);
