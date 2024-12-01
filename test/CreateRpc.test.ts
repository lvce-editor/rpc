import { expect, jest, test } from '@jest/globals'
import * as CreateRpc from '../src/parts/CreateRpc/CreateRpc.js'

test('createRpc - creates rpc object with expected methods', () => {
  const mockIpc = {
    send: jest.fn(),
    invoke: jest.fn(),
  }
  const rpc = CreateRpc.createRpc(mockIpc)
  expect(typeof rpc.send).toBe('function')
  expect(typeof rpc.invoke).toBe('function')
  expect(typeof rpc.invokeAndTransfer).toBe('function')
})

test.skip('createRpc - invoke calls underlying ipc', async () => {
  const mockIpc = {
    send: jest.fn(),
    // @ts-ignore
    invoke: jest.fn().mockResolvedValue('result'),
  }
  const rpc = CreateRpc.createRpc(mockIpc)
  const result = await rpc.invoke('test-method', 'arg1', 'arg2')
  expect(mockIpc.invoke).toHaveBeenCalledWith('test-method', 'arg1', 'arg2')
  expect(result).toBe('result')
})
