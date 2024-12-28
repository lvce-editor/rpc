import { beforeEach, expect, jest, jest as jestModule, test } from '@jest/globals'

const mockCommand = {
  register: jest.fn(),
}

const mockIpcParentWithMessagePort = {
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
  mockIpcParentWithMessagePort.create.mockClear()
  mockIpcParentWithMessagePort.wrap.mockClear()
  mockHandleIpc.handleIpc.mockClear()
  mockCreateRpc.createRpc.mockClear()
})

await jestModule.unstable_mockModule('../src/parts/Command/Command.js', () => mockCommand)
await jestModule.unstable_mockModule('@lvce-editor/ipc', () => ({
  IpcParentWithMessagePort: mockIpcParentWithMessagePort,
}))
await jestModule.unstable_mockModule('../src/parts/HandleIpc/HandleIpc.js', () => mockHandleIpc)
await jestModule.unstable_mockModule('../src/parts/CreateRpc/CreateRpc.js', () => mockCreateRpc)

const { create } = await import('../src/parts/MessagePortRpcParent/MessagePortRpcParent.js')

test('create - creates rpc parent with message port', async () => {
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
  const mockMessagePort = {}
  const isMessagePortOpen = true

  // @ts-ignore
  mockIpcParentWithMessagePort.create.mockResolvedValue(mockRawIpc)
  mockIpcParentWithMessagePort.wrap.mockReturnValue(mockIpc)
  mockCreateRpc.createRpc.mockReturnValue(mockRpc)

  const mockCommandMap = { testCommand: jest.fn() }

  const result = await create({
    commandMap: mockCommandMap,
    // @ts-ignore
    messagePort: mockMessagePort,
    isMessagePortOpen,
  })

  expect(mockCommand.register).toHaveBeenCalledWith(mockCommandMap)
  expect(mockIpcParentWithMessagePort.create).toHaveBeenCalledWith({
    messagePort: mockMessagePort,
    isMessagePortOpen,
  })
  expect(mockIpcParentWithMessagePort.wrap).toHaveBeenCalledWith(mockRawIpc)
  expect(mockHandleIpc.handleIpc).toHaveBeenCalledWith(mockIpc)
  expect(mockCreateRpc.createRpc).toHaveBeenCalledWith(mockIpc)
  expect(result).toBe(mockRpc)
})
