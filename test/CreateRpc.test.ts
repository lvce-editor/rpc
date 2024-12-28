import { expect, jest, test } from '@jest/globals'
import * as CreateRpc from '../src/parts/CreateRpc/CreateRpc.js'
import * as HandleIpc from '../src/parts/HandleIpc/HandleIpc.js'

class MockIpc extends EventTarget {
  #port1: MessagePort
  #port2: MessagePort
  send: jest.Mock
  sendAndTransfer: jest.Mock

  constructor() {
    super()
    const channel = new MessageChannel()
    this.#port1 = channel.port1
    this.#port2 = channel.port2

    this.#port2.addEventListener('message', (event) => {
      const newEvent = new MessageEvent('message', {
        data: event.data,
      })
      this.dispatchEvent(newEvent)
    })

    this.send = jest.fn((message: any) => {
      this.#port1.postMessage(message)
    })

    this.sendAndTransfer = jest.fn((message: any, transfer: any) => {
      this.#port1.postMessage(message, { transfer })
    })
  }
}

test('createRpc - creates rpc object with expected methods', () => {
  const mockIpc = new MockIpc()
  const rpc = CreateRpc.createRpc(mockIpc)
  expect(typeof rpc.send).toBe('function')
  expect(typeof rpc.invoke).toBe('function')
  expect(typeof rpc.invokeAndTransfer).toBe('function')
})

test('createRpc - send method calls underlying ipc send', () => {
  const mockIpc = new MockIpc()
  const rpc = CreateRpc.createRpc(mockIpc)
  rpc.send('test-method', 'arg1', 'arg2')
  expect(mockIpc.send).toHaveBeenCalledWith({
    jsonrpc: '2.0',
    method: 'test-method',
    params: ['arg1', 'arg2'],
  })
})

test('createRpc - invoke method sends message and receives response', async () => {
  const mockIpc = new MockIpc()
  HandleIpc.handleIpc(mockIpc)
  const rpc = CreateRpc.createRpc(mockIpc)

  mockIpc.send.mockImplementation((message: any) => {
    mockIpc.dispatchEvent(
      new MessageEvent('message', {
        data: {
          jsonrpc: '2.0',
          id: message.id,
          result: 'test-result',
        },
      }),
    )
  })

  const result = await rpc.invoke('test-method', 'arg1', 'arg2')
  expect(mockIpc.send).toHaveBeenCalledWith({
    jsonrpc: '2.0',
    id: expect.any(Number),
    method: 'test-method',
    params: ['arg1', 'arg2'],
  })
  expect(result).toBe('test-result')
})

test('createRpc - invokeAndTransfer method sends message with transfer and receives response', async () => {
  const mockIpc = new MockIpc()
  HandleIpc.handleIpc(mockIpc)
  const rpc = CreateRpc.createRpc(mockIpc)
  const transferable = new ArrayBuffer(8)

  mockIpc.sendAndTransfer.mockImplementation((message: any) => {
    mockIpc.dispatchEvent(
      new MessageEvent('message', {
        data: {
          jsonrpc: '2.0',
          id: message.id,
          result: 'test-result',
        },
      }),
    )
  })

  const result = await rpc.invokeAndTransfer('test-method', transferable)
  expect(mockIpc.sendAndTransfer).toHaveBeenCalledWith({
    jsonrpc: '2.0',
    id: expect.any(Number),
    method: 'test-method',
    params: [transferable],
  })
  expect(result).toBe('test-result')
})

test('createRpc - invoke method handles rejection', async () => {
  const mockIpc = new MockIpc()
  HandleIpc.handleIpc(mockIpc)

  mockIpc.send.mockImplementation((message: any) => {
    mockIpc.dispatchEvent(
      new MessageEvent('message', {
        data: {
          jsonrpc: '2.0',
          id: message.id,
          error: {
            message: 'Test error',
          },
        },
      }),
    )
  })

  const rpc = CreateRpc.createRpc(mockIpc)
  await expect(rpc.invoke('test-method', 'arg1')).rejects.toThrow('Test error')
})

test('createRpc - invokeAndTransfer method handles rejection', async () => {
  const mockIpc = new MockIpc()
  HandleIpc.handleIpc(mockIpc)
  const transferable = new ArrayBuffer(8)

  mockIpc.sendAndTransfer.mockImplementation((message: any) => {
    mockIpc.dispatchEvent(
      new MessageEvent('message', {
        data: {
          jsonrpc: '2.0',
          id: message.id,
          error: {
            message: 'Test error',
          },
        },
      }),
    )
  })

  const rpc = CreateRpc.createRpc(mockIpc)
  await expect(rpc.invokeAndTransfer('test-method', transferable)).rejects.toThrow('Test error')
})
