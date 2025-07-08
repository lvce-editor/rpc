import { beforeEach, expect, jest, test } from '@jest/globals'

const mockCommand = {
  register: jest.fn(),
}

const mockIpcParentWithModuleWorker = {
  create: jest.fn(),
  wrap: jest.fn(),
}

const mockHandleIpc = {
  handleIpc: jest.fn(),
  unhandleIpc: jest.fn(),
}

const mockCreateRpc = {
  createRpc: jest.fn(),
}

const mockIsWorker = {
  isWorker: jest.fn(),
}

beforeEach(() => {
  mockCommand.register.mockClear()
  mockIpcParentWithModuleWorker.create.mockClear()
  mockIpcParentWithModuleWorker.wrap.mockClear()
  mockHandleIpc.handleIpc.mockClear()
  mockHandleIpc.unhandleIpc.mockClear()
  mockCreateRpc.createRpc.mockClear()
  mockIsWorker.isWorker.mockClear()
})

jest.unstable_mockModule('../src/parts/Command/Command.js', () => mockCommand)
jest.unstable_mockModule('@lvce-editor/ipc', () => ({
  IpcParentWithModuleWorker: mockIpcParentWithModuleWorker,
}))
jest.unstable_mockModule('../src/parts/HandleIpc/HandleIpc.js', () => mockHandleIpc)
jest.unstable_mockModule('../src/parts/CreateRpc/CreateRpc.js', () => mockCreateRpc)
jest.unstable_mockModule('../src/parts/IsWorker/IsWorker.js', () => mockIsWorker)

const { create } = await import(
  '../src/parts/ModuleWorkerWithMessagePortRpcParent/ModuleWorkerWithMessagePortRpcParent.js'
)

test('create - creates rpc parent with module worker and message port', async () => {
  const mockWorker = {
    type: 'Worker',
  }
  const mockIpc = {
    wrapped: true,
  }
  const mockRpc = {
    send: jest.fn(),
    invoke: jest.fn(),
  }
  const mockMessagePort = {}
  const mockCommandMap = { testCommand: jest.fn() }
  const url = 'test-url'

  // @ts-ignore
  mockIpcParentWithModuleWorker.create.mockResolvedValue(mockWorker)
  mockIpcParentWithModuleWorker.wrap.mockReturnValue(mockIpc)
  mockCreateRpc.createRpc.mockReturnValue(mockRpc)
  mockIsWorker.isWorker.mockReturnValue(true)

  const result = await create({
    commandMap: mockCommandMap,
    url,
    // @ts-ignore
    port: mockMessagePort,
    name: 'test-worker',
  })

  expect(mockCommand.register).toHaveBeenCalledWith(mockCommandMap)
  expect(mockIpcParentWithModuleWorker.create).toHaveBeenCalledWith({
    url,
    name: 'test-worker',
  })
  expect(mockIsWorker.isWorker).toHaveBeenCalledWith(mockWorker)
  expect(mockIpcParentWithModuleWorker.wrap).toHaveBeenCalledWith(mockWorker)
  expect(mockHandleIpc.handleIpc).toHaveBeenCalledWith(mockIpc)
  expect(mockCreateRpc.createRpc).toHaveBeenCalledWith(mockIpc)
  expect(mockRpc.invoke).toHaveBeenCalledWith('initialize', 'message-port', mockMessagePort)
  expect(mockHandleIpc.unhandleIpc).toHaveBeenCalledWith(mockIpc)
  expect(result).toBe(mockRpc)
})

test('create - throws error when worker is not of type Worker', async () => {
  const mockWorker = {
    type: 'NotWorker',
  }
  const mockMessagePort = {}
  const mockCommandMap = { testCommand: jest.fn() }
  const url = 'test-url'

  // @ts-ignore
  mockIpcParentWithModuleWorker.create.mockResolvedValue(mockWorker)
  mockIsWorker.isWorker.mockReturnValue(false)

  await expect(
    create({
      commandMap: mockCommandMap,
      url,
      // @ts-ignore
      port: mockMessagePort,
    }),
  ).rejects.toThrow('worker must be of type Worker')

  expect(mockCommand.register).toHaveBeenCalledWith(mockCommandMap)
  expect(mockIpcParentWithModuleWorker.create).toHaveBeenCalledWith({
    url,
    name: undefined,
  })
  expect(mockIsWorker.isWorker).toHaveBeenCalledWith(mockWorker)
})
