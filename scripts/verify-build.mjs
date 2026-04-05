import { readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const distAssets = path.join(root, 'dist', 'assets')
const statsPath = path.join(root, 'stats.html')

async function assertExists(filePath, label) {
  try {
    await stat(filePath)
  } catch {
    throw new Error(`${label} is missing: ${filePath}`)
  }
}

await assertExists(path.join(root, 'dist'), 'dist output')
await assertExists(statsPath, 'bundle stats report')
await assertExists(distAssets, 'dist assets folder')

const files = await readdir(distAssets)
const jsFiles = files.filter((file) => file.endsWith('.js'))
if (jsFiles.length < 2) {
  throw new Error(`Expected at least 2 JS chunks, found ${jsFiles.length}`)
}

const bundleText = await Promise.all(
  jsFiles.map(async (file) => readFile(path.join(distAssets, file), 'utf8')),
)

if (bundleText.some((text) => text.includes('isEqual'))) {
  throw new Error('Unexpected lodash isEqual string found in production bundle')
}

console.log('Build verification passed')
console.log(`JS chunks: ${jsFiles.join(', ')}`)
console.log('stats.html present')
