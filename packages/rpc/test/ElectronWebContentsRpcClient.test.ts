import { beforeEach, expect, jest, test } from '@jest/globals'

const mockCommand = {
  register: jest.fn(),
}

const mockHandleIpc = {
  handleIpc: jest.fn(),
}

const mockCreateRpc = {
  createRpc: jest.fn(),
}

const mockIpcChildWithRendererProcess2 = {
  wrap: jest.fn(),
}

beforeEach(() => {
  mockCommand.register.mockClear()
  mockHandleIpc.handleIpc.mockClear()
  mockCreateRpc.createRpc.mockClear()
  mockIpcChildWithRendererProcess2.wrap.mockClear()
})

jest.unstable_mockModule('../src/parts/Command/Command.js', () => mockCommand)
jest.unstable_mockModule('../src/parts/HandleIpc/HandleIpc.js', () => mockHandleIpc)
jest.unstable_mockModule('../src/parts/CreateRpc/CreateRpc.js', () => mockCreateRpc)
jest.unstable_mockModule('@lvce-editor/ipc', () => ({
  IpcChildWithRendererProcess2: mockIpcChildWithRendererProcess2,
}))

test('create returns rpc and sets up ipc with requiresSocket', async () => {
  const mockIpc = {
    requiresSocket: undefined,
  }
  const mockRpc = {
    dispose: jest.fn(),
    invoke: jest.fn(),
    invokeAndTransfer: jest.fn(),
    send: jest.fn(),
  }

  mockIpcChildWithRendererProcess2.wrap.mockReturnValue(mockIpc)
  mockCreateRpc.createRpc.mockReturnValue(mockRpc)

  const { create } = await import('../src/parts/ElectronWebContentsRpcClient/ElectronWebContentsRpcClient.js')

  const commandMap = { foo: 'bar' }
  const webContents = { id: 1 }
  const requiresSocket = { socket: true }

  const rpc = await create({ commandMap, requiresSocket, webContents })

  expect(mockCommand.register).toHaveBeenCalledWith(commandMap)
  expect(mockIpcChildWithRendererProcess2.wrap).toHaveBeenCalledWith(webContents)
  expect(mockIpc.requiresSocket).toBe(requiresSocket)
  expect(mockHandleIpc.handleIpc).toHaveBeenCalledWith(mockIpc)
  expect(mockCreateRpc.createRpc).toHaveBeenCalledWith(mockIpc)
  expect(rpc).toBe(mockRpc)
})

test('create returns rpc without requiresSocket', async () => {
  const mockIpc = {
    requiresSocket: undefined,
  }
  const mockRpc = {
    dispose: jest.fn(),
    invoke: jest.fn(),
    invokeAndTransfer: jest.fn(),
    send: jest.fn(),
  }

  mockIpcChildWithRendererProcess2.wrap.mockReturnValue(mockIpc)
  mockCreateRpc.createRpc.mockReturnValue(mockRpc)

  const { create } = await import('../src/parts/ElectronWebContentsRpcClient/ElectronWebContentsRpcClient.js')

  const commandMap = { foo: 'bar' }
  const webContents = { id: 2 }

  const rpc = await create({ commandMap, webContents })

  expect(mockCommand.register).toHaveBeenCalledWith(commandMap)
  expect(mockIpcChildWithRendererProcess2.wrap).toHaveBeenCalledWith(webContents)
  expect(mockIpc.requiresSocket).toBeUndefined()
  expect(mockHandleIpc.handleIpc).toHaveBeenCalledWith(mockIpc)
  expect(mockCreateRpc.createRpc).toHaveBeenCalledWith(mockIpc)
  expect(rpc).toBe(mockRpc)
})