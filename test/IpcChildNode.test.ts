import { beforeEach, expect, jest, test } from '@jest/globals'

const mockIpcChildWithWebSocket = {
  create: jest.fn(),
}

beforeEach(() => {
  mockIpcChildWithWebSocket.create.mockClear()
})

jest.unstable_mockModule('@lvce-editor/ipc', () => ({
  IpcChildWithWebSocket: mockIpcChildWithWebSocket,
}))

const { listen } = await import('../src/parts/IpcChildNode/IpcChildNode.js')

test('listen - creates ipc child with given transport and options', async () => {
  const mockIpc = {
    send: jest.fn(),
    invoke: jest.fn(),
  }
  const mockTransport = mockIpcChildWithWebSocket
  const mockOptions = {
    request: {},
    handle: {},
  }

  mockIpcChildWithWebSocket.create.mockResolvedValue(mockIpc)

  const result = await listen(mockTransport, mockOptions)

  expect(mockTransport.create).toHaveBeenCalledWith(mockOptions)
  expect(result).toBe(mockIpc)
})

test('listen - creates ipc child with transport and no options', async () => {
  const mockIpc = {
    send: jest.fn(),
    invoke: jest.fn(),
  }
  const mockTransport = mockIpcChildWithWebSocket

  mockIpcChildWithWebSocket.create.mockResolvedValue(mockIpc)

  const result = await listen(mockTransport)

  expect(mockTransport.create).toHaveBeenCalledWith(undefined)
  expect(result).toBe(mockIpc)
})
