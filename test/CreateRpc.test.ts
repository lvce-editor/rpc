import { expect, jest, test } from '@jest/globals'
import * as CreateRpc from '../src/parts/CreateRpc/CreateRpc.js'

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
