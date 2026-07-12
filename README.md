# Multipage Webpack Scaffolding

一个基于 Webpack 5 的多页面官网脚手架，支持 ES modules、Less、PostCSS、资源指纹、热更新和按需 polyfill。

## 开始

需要 Node.js 20 或更高版本。

```bash
corepack enable
pnpm install
pnpm dev
```

生产构建与完整检查：

```bash
pnpm build
pnpm check
```

## 页面约定

每个页面是 `src/pages` 下的一个目录。构建工具会自动发现页面，无需再维护 `page.config.js`。

```text
src/pages/pricing/
├── index.html       # 也可以是 index.ejs
├── index.js
└── index.less
```

为兼容旧项目，`pricing.html + pricing.js` 也可被发现。`home` 目录输出 `index.html`，其他目录输出 `<目录名>.html`。以 `_` 开头的目录作为共享模板目录，不会生成页面。

## 资源与样式

- JavaScript 中可以用 `@/` 指向 `src/`，例如 `import '@/common/css/com.less'`。
- CSS/Less 中的 `url(...)` 和 HTML 中的 `<img src="...">` 会由 Webpack 处理，生成正确的带指纹路径。
- 开发和生产均把 CSS 抽取为 `<link>` 并放入页面，避免 JavaScript 运行后才注入样式导致的首屏闪烁。
- Autoprefixer 会处理导入的 CSS/Less。HTML 的 `style="..."` 属性不是 CSS Loader 的输入，建议改为 class 并放入 CSS/Less，这样才能获得前缀、压缩和缓存。

## 兼容性

`browserslist` 是唯一的浏览器范围配置。Babel 使用 `useBuiltIns: "usage"` 按实际使用注入 `core-js` polyfill，不需要在每个入口手动导入整包 polyfill。

## 构建配置

```text
build/
├── paths.js            # 统一路径
├── pages.js            # 页面发现与校验
├── webpack.common.js   # loader、plugin 和输出规则
├── webpack.dev.js      # 开发服务器
└── webpack.prod.js     # 压缩与生产优化
```

HtmlWebpackPlugin 在生产环境默认压缩 HTML。如果项目确实需要保留格式，可在 `build/webpack.common.js` 中将 `minify: production` 改为 `minify: false`。

## Docker

```bash
docker build -t multipage-webpack .
docker run --rm -p 5000:8080 multipage-webpack
```

访问 <http://localhost:5000>。Docker 构建使用当前工作区代码，不会在镜像内重新 clone 远程仓库。
