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

const mockIpcChildWithElectronWindow = {
  wrap: jest.fn(),
}

beforeEach(() => {
  mockCommand.register.mockClear()
  mockHandleIpc.handleIpc.mockClear()
  mockCreateRpc.createRpc.mockClear()
  mockIpcChildWithElectronWindow.wrap.mockClear()
})

jest.unstable_mockModule('../src/parts/Command/Command.js', () => mockCommand)
jest.unstable_mockModule('../src/parts/HandleIpc/HandleIpc.js', () => mockHandleIpc)
jest.unstable_mockModule('../src/parts/CreateRpc/CreateRpc.js', () => mockCreateRpc)
jest.unstable_mockModule('@lvce-editor/ipc', () => ({
  IpcChildWithElectronWindow: mockIpcChildWithElectronWindow,
}))

test('create returns rpc and sets up ipc', async () => {
  const mockIpc = {}
  const mockRpc = {
    dispose: jest.fn(),
    invoke: jest.fn(),
    invokeAndTransfer: jest.fn(),
    send: jest.fn(),
  }

  mockIpcChildWithElectronWindow.wrap.mockReturnValue(mockIpc)
  mockCreateRpc.createRpc.mockReturnValue(mockRpc)

  const { create } = await import('../src/parts/ElectronWindowRpcClient/ElectronWindowRpcClient.js')

  const commandMap = { foo: 'bar' }
  const window = { id: 1 }

  const rpc = await create({ commandMap, window })

  expect(mockCommand.register).toHaveBeenCalledWith(commandMap)
  expect(mockIpcChildWithElectronWindow.wrap).toHaveBeenCalledWith(window)
  expect(mockHandleIpc.handleIpc).toHaveBeenCalledWith(mockIpc)
  expect(mockCreateRpc.createRpc).toHaveBeenCalledWith(mockIpc)
  expect(rpc).toBe(mockRpc)
})
