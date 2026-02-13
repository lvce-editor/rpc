import { execa } from 'execa'
import { join } from 'path'
import { root } from './root.js'
import { cp } from 'fs/promises'

export const bundleJs = async () => {
  await execa(`npx`, ['tsc', '-b'], {
    cwd: join(root, 'packages', 'rpc'),
  })
  await cp(join(root, 'packages', 'rpc', 'dist', 'src'), join(root, '.tmp', 'dist', 'dist'), { recursive: true })
}
