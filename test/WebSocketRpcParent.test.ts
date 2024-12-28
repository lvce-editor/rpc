import { beforeEach, expect, jest, jest as jestModule, test } from '@jest/globals'

const mockCommand = {
  register: jest.fn(),
}

const mockIpcParentWithWebSocket = {
  create: jest.fn(),
  wrap: jest.fn(),
}

const mockHandleIpc = {
  handleIpc: jest.fn(),
}

const mockCreateRpc = {
  createRpc: jest.fn(),
}

beforeEach(() => {
  mockCommand.register.mockClear()
  mockIpcParentWithWebSocket.create.mockClear()
  mockIpcParentWithWebSocket.wrap.mockClear()
  mockHandleIpc.handleIpc.mockClear()
  mockCreateRpc.createRpc.mockClear()
})

await jestModule.unstable_mockModule('../src/parts/Command/Command.js', () => mockCommand)
await jestModule.unstable_mockModule('@lvce-editor/ipc', () => ({
  IpcParentWithWebSocket: mockIpcParentWithWebSocket,
}))
await jestModule.unstable_mockModule('../src/parts/HandleIpc/HandleIpc.js', () => mockHandleIpc)
await jestModule.unstable_mockModule('../src/parts/CreateRpc/CreateRpc.js', () => mockCreateRpc)

const { create } = await import('../src/parts/WebSocketRpcParent/WebSocketRpcParent.js')

test('create - creates rpc parent with websocket', async () => {
  const mockRawIpc = {
    raw: true,
  }
  const mockIpc = {
    wrapped: true,
  }
  const mockRpc = {
    send: jest.fn(),
    invoke: jest.fn(),
  }
  const mockWebSocket = {}

  // @ts-ignore
  mockIpcParentWithWebSocket.create.mockResolvedValue(mockRawIpc)
  mockIpcParentWithWebSocket.wrap.mockReturnValue(mockIpc)
  mockCreateRpc.createRpc.mockReturnValue(mockRpc)

  const mockCommandMap = { testCommand: jest.fn() }

  const result = await create({
    commandMap: mockCommandMap,
    // @ts-ignore
    webSocket: mockWebSocket,
  })

  expect(mockCommand.register).toHaveBeenCalledWith(mockCommandMap)
  expect(mockIpcParentWithWebSocket.create).toHaveBeenCalledWith({
    webSocket: mockWebSocket,
  })
  expect(mockIpcParentWithWebSocket.wrap).toHaveBeenCalledWith(mockRawIpc)
  expect(mockHandleIpc.handleIpc).toHaveBeenCalledWith(mockIpc)
  expect(mockCreateRpc.createRpc).toHaveBeenCalledWith(mockIpc)
  expect(result).toBe(mockRpc)
})
