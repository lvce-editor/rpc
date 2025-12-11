import { beforeEach, expect, jest, test } from '@jest/globals'

const mockCommand = {
  register: jest.fn(),
}

const mockIpcChild = {
  listen: jest.fn(),
}

const mockHandleIpc = {
  handleIpc: jest.fn(),
}

const mockCreateRpc = {
  createRpc: jest.fn(),
}

beforeEach(() => {
  mockCommand.register.mockClear()
  mockIpcChild.listen.mockClear()
  mockHandleIpc.handleIpc.mockClear()
  mockCreateRpc.createRpc.mockClear()
})

jest.unstable_mockModule('../src/parts/Command/Command.js', () => mockCommand)
jest.unstable_mockModule('../src/parts/IpcChildNode/IpcChildNode.js', () => mockIpcChild)
jest.unstable_mockModule('../src/parts/HandleIpc/HandleIpc.js', () => mockHandleIpc)
jest.unstable_mockModule('../src/parts/CreateRpc/CreateRpc.js', () => mockCreateRpc)

const { create } = await import('../src/parts/ElectronUtilityProcessRpcClient/ElectronUtilityProcessRpcClient.js')

test('create - creates rpc client with electron utility process', async () => {
  const mockIpc = {
    invoke: jest.fn(),
    send: jest.fn(),
  }
  const mockRpc = {
    invoke: jest.fn(),
    send: jest.fn(),
  }

  // @ts-ignore
  mockIpcChild.listen.mockResolvedValue(mockIpc)
  mockCreateRpc.createRpc.mockReturnValue(mockRpc)

  const mockCommandMap = { testCommand: jest.fn() }

  const result = await create({
    commandMap: mockCommandMap,
  })

  expect(mockCommand.register).toHaveBeenCalledWith(mockCommandMap)
  expect(mockIpcChild.listen).toHaveBeenCalledWith(expect.anything())
  expect(mockHandleIpc.handleIpc).toHaveBeenCalledWith(mockIpc)
  expect(mockCreateRpc.createRpc).toHaveBeenCalledWith(mockIpc)
  expect(result).toBe(mockRpc)
})
