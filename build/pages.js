const fs = require('node:fs')
const path = require('node:path')
const paths = require('./paths')

const TEMPLATE_EXTENSIONS = ['.html', '.ejs']

function findFile(directory, stems, extensions) {
  for (const stem of stems) {
    for (const extension of extensions) {
      const candidate = path.join(directory, `${stem}${extension}`)
      if (fs.existsSync(candidate)) return candidate
    }
  }
  return null
}

function discoverPages(pagesDirectory = paths.pages) {
  if (!fs.existsSync(pagesDirectory)) return []

  return fs.readdirSync(pagesDirectory, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && !entry.name.startsWith('_'))
    .map(entry => {
      const directory = path.join(pagesDirectory, entry.name)
      const stems = ['index', entry.name]
      const template = findFile(directory, stems, TEMPLATE_EXTENSIONS)
      const script = findFile(directory, stems, ['.js'])

      if (!template || !script) {
        throw new Error(
          `Page "${entry.name}" must contain index.js (or ${entry.name}.js) and ` +
          `index.html/index.ejs (or ${entry.name}.html/${entry.name}.ejs)`
        )
      }

      return {
        name: entry.name === 'home' ? 'index' : entry.name,
        script,
        template
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
}

module.exports = { discoverPages }
