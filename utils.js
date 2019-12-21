
const pageConfig = require('./page.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

exports.pushHtmlWebpackPlugins = (webpackConfig, options = {}) => {
    if (pageConfig && Array.isArray(pageConfig)) {
        pageConfig.map(page => {
            webpackConfig.entry[page.name] = `./src/pages/${page.jsEntry}`;
            let template = path.join(__dirname, `/src/pages/${page.html}`);
            // 如果是ejs文件，启用ejs-loader编译
            if (path.extname(page.html) === '.ejs') {
                template = `!!ejs-loader!${template}`;
            }
            webpackConfig.plugins.push(new HtmlWebpackPlugin({
                filename: path.join(__dirname, `/dist/${page.name}.html`),
                template,
                inject: true,
                chunks: [page.name],
                inlineSource: '.(js|css)$',
                chunksSortMode: 'dependency',
                ...options
            }))
        })
    }
    return webpackConfig
}
