import { execa } from 'execa'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { root } from './root.js'

const getActualContent = (content) => {
  const lines = content.split('\n')
  const newLines = lines
  return newLines.join('\n')
}

export const generateApiTypes = async () => {
  const ext = process.platform === 'win32' ? '' : ''
  const bundleGeneratorPath = join(root, 'packages', 'build', 'node_modules', '.bin', 'dts-bundle-generator' + ext)
  await execa(bundleGeneratorPath, ['-o', '../../.tmp/dist/dist/index.d.ts', 'src/parts/Main/Main.ts'], {
    cwd: join(root, 'packages', 'rpc'),
    reject: false,
  })
  const content = await readFile(join(root, '.tmp', 'dist', 'dist', 'index.d.ts'), 'utf8')
  const actual = getActualContent(content)
  await writeFile(join(root, '.tmp', 'dist', 'dist', 'index.d.ts'), actual)
}
