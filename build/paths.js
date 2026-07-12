const path = require('node:path')

const root = path.resolve(__dirname, '..')

module.exports = {
  root,
  src: path.join(root, 'src'),
  pages: path.join(root, 'src/pages'),
  dist: path.join(root, 'dist')
}
