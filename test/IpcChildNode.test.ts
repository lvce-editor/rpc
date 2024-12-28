import { expect, jest, test } from '@jest/globals'
import { listen } from '../src/parts/IpcChildNode/IpcChildNode.js'

test('listen - creates ipc child with given transport and options', async () => {
  const rawIpc = {}
  const wrappedIpc = {}
  const module = {
    listen: jest.fn(() => {
      return rawIpc
    }),
    signal() {},
    wrap() {
      return wrappedIpc
    },
  }
  const options = {}
  const result = await listen(module, options)

  expect(module.listen).toHaveBeenCalledWith(options)
  expect(result).toBe(wrappedIpc)
})
