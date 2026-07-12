const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const test = require('node:test')
const { discoverPages } = require('../build/pages')

function fixture(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'multipage-'))
  for (const file of files) {
    const target = path.join(root, file)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.writeFileSync(target, '')
  }
  return root
}

test('discovers convention-based pages and maps home to index', () => {
  const root = fixture(['home/index.js', 'home/index.html', 'about/about.js', 'about/about.html'])
  const pages = discoverPages(root)

  assert.deepEqual(pages.map(page => page.name), ['about', 'index'])
})

test('rejects incomplete pages with an actionable error', () => {
  const root = fixture(['contact/index.html'])

  assert.throws(() => discoverPages(root), /must contain index\.js/)
})

test('ignores underscore-prefixed shared directories', () => {
  const root = fixture(['_shared/header.html', 'home/index.js', 'home/index.html'])

  assert.equal(discoverPages(root).length, 1)
})
