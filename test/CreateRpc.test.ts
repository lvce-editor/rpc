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

test('createRpc - send method calls underlying ipc send', () => {
  const mockIpc = {
    send: jest.fn(),
    invoke: jest.fn(),
  }
  const rpc = CreateRpc.createRpc(mockIpc)
  rpc.send('test-method', 'arg1', 'arg2')
  expect(mockIpc.send).toHaveBeenCalledWith('test-method', 'arg1', 'arg2')
})

test('createRpc - invoke method calls underlying ipc invoke', async () => {
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

test('createRpc - invokeAndTransfer method calls underlying ipc invoke', async () => {
  const mockIpc = {
    send: jest.fn(),
    // @ts-ignore
    invoke: jest.fn().mockResolvedValue('result'),
  }
  const rpc = CreateRpc.createRpc(mockIpc)
  const result = await rpc.invokeAndTransfer('test-method', 'arg1', 'arg2')
  expect(mockIpc.invoke).toHaveBeenCalledWith('test-method', 'arg1', 'arg2')
  expect(result).toBe('result')
})

test('createRpc - invoke method handles rejection', async () => {
  const mockError = new Error('test error')
  const mockIpc = {
    send: jest.fn(),
    // @ts-ignore
    invoke: jest.fn().mockRejectedValue(mockError),
  }
  const rpc = CreateRpc.createRpc(mockIpc)
  await expect(rpc.invoke('test-method', 'arg1')).rejects.toThrow(mockError)
})

test('createRpc - invokeAndTransfer method handles rejection', async () => {
  const mockError = new Error('test error')
  const mockIpc = {
    send: jest.fn(),
    // @ts-ignore
    invoke: jest.fn().mockRejectedValue(mockError),
  }
  const rpc = CreateRpc.createRpc(mockIpc)
  await expect(rpc.invokeAndTransfer('test-method', 'arg1')).rejects.toThrow(mockError)
})
