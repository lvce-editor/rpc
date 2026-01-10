import { beforeEach, expect, jest, test } from '@jest/globals'

const mockCommand = {
  register: jest.fn(),
}

const mockIpcParentWithElectronUtilityProcess = {
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
  mockIpcParentWithElectronUtilityProcess.create.mockClear()
  mockIpcParentWithElectronUtilityProcess.wrap.mockClear()
  mockHandleIpc.handleIpc.mockClear()
  mockCreateRpc.createRpc.mockClear()
})

jest.unstable_mockModule('../src/parts/Command/Command.js', () => mockCommand)
jest.unstable_mockModule('@lvce-editor/ipc', () => ({
  IpcParentWithElectronUtilityProcess: mockIpcParentWithElectronUtilityProcess,
}))
jest.unstable_mockModule('../src/parts/HandleIpc/HandleIpc.js', () => mockHandleIpc)
jest.unstable_mockModule('../src/parts/CreateRpc/CreateRpc.js', () => mockCreateRpc)

const { create } = await import('../src/parts/ElectronUtilityProcessRpcParent/ElectronUtilityProcessRpcParent.js')

test('create - creates rpc parent with electron utility process', async () => {
  const mockRawIpc = {
    raw: true,
  }
  const mockIpc = {
    wrapped: true,
  }
  const mockRpc = {
    invoke: jest.fn(),
    send: jest.fn(),
  }

  // @ts-ignore
  mockIpcParentWithElectronUtilityProcess.create.mockResolvedValue(mockRawIpc)
  mockIpcParentWithElectronUtilityProcess.wrap.mockReturnValue(mockIpc)
  mockCreateRpc.createRpc.mockReturnValue(mockRpc)

  const mockCommandMap = { testCommand: jest.fn() }
  const argv = ['electron', 'app.js']
  const execArgv = ['--inspect']
  const path = '/path/to/utility.js'
  const name = 'utility-process'
  const env = { NODE_ENV: 'test' }

  const result = await create({
    argv,
    commandMap: mockCommandMap,
    env,
    execArgv,
    name,
    path,
  })

  expect(mockCommand.register).toHaveBeenCalledWith(mockCommandMap)
  expect(mockIpcParentWithElectronUtilityProcess.create).toHaveBeenCalledWith({
    argv,
    env,
    execArgv,
    name,
    path,
  })
  expect(mockIpcParentWithElectronUtilityProcess.wrap).toHaveBeenCalledWith(mockRawIpc)
  expect(mockHandleIpc.handleIpc).toHaveBeenCalledWith(mockIpc)
  expect(mockCreateRpc.createRpc).toHaveBeenCalledWith(mockIpc)
  expect(result).toBe(mockRpc)
})

test('create - creates rpc parent with minimal options', async () => {
  const mockRawIpc = {
    raw: true,
  }
  const mockIpc = {
    wrapped: true,
  }
  const mockRpc = {
    invoke: jest.fn(),
    send: jest.fn(),
  }

  // @ts-ignore
  mockIpcParentWithElectronUtilityProcess.create.mockResolvedValue(mockRawIpc)
  mockIpcParentWithElectronUtilityProcess.wrap.mockReturnValue(mockIpc)
  mockCreateRpc.createRpc.mockReturnValue(mockRpc)

  const mockCommandMap = { testCommand: jest.fn() }
  const path = '/path/to/utility.js'
  const name = 'utility-process'

  const result = await create({
    commandMap: mockCommandMap,
    name,
    path,
  })

  expect(mockCommand.register).toHaveBeenCalledWith(mockCommandMap)
  expect(mockIpcParentWithElectronUtilityProcess.create).toHaveBeenCalledWith({
    argv: undefined,
    env: undefined,
    execArgv: undefined,
    name,
    path,
  })
  expect(mockIpcParentWithElectronUtilityProcess.wrap).toHaveBeenCalledWith(mockRawIpc)
  expect(mockHandleIpc.handleIpc).toHaveBeenCalledWith(mockIpc)
  expect(mockCreateRpc.createRpc).toHaveBeenCalledWith(mockIpc)
  expect(result).toBe(mockRpc)
})

test('create - sets requiresSocket on ipc when provided', async () => {
  const mockRawIpc = {
    raw: true,
  }
  const mockIpc: any = {
    wrapped: true,
  }
  const mockRpc = {
    invoke: jest.fn(),
    send: jest.fn(),
  }

  // @ts-ignore
  mockIpcParentWithElectronUtilityProcess.create.mockResolvedValue(mockRawIpc)
  mockIpcParentWithElectronUtilityProcess.wrap.mockReturnValue(mockIpc)
  mockCreateRpc.createRpc.mockReturnValue(mockRpc)

  const mockCommandMap = { testCommand: jest.fn() }
  const path = '/path/to/utility.js'
  const name = 'utility-process'
  const requiresSocket = true

  const result = await create({
    commandMap: mockCommandMap,
    name,
    path,
    requiresSocket,
  })

  expect(mockCommand.register).toHaveBeenCalledWith(mockCommandMap)
  expect(mockIpcParentWithElectronUtilityProcess.create).toHaveBeenCalledWith({
    argv: undefined,
    env: undefined,
    execArgv: undefined,
    name,
    path,
  })
  expect(mockIpcParentWithElectronUtilityProcess.wrap).toHaveBeenCalledWith(mockRawIpc)
  expect(mockIpc.requiresSocket).toBe(requiresSocket)
  expect(mockHandleIpc.handleIpc).toHaveBeenCalledWith(mockIpc)
  expect(mockCreateRpc.createRpc).toHaveBeenCalledWith(mockIpc)
  expect(result).toBe(mockRpc)
})
