
const webpackBaseConfig = require('./webpack.config.base');
const merge = require('webpack-merge');
const utils = require('./utils');

module.exports = utils.genHtmlWebpackPlugins(
	merge(webpackBaseConfig, {
		mode: 'development'
	})
);
