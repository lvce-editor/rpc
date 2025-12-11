import { beforeEach, expect, jest, test } from '@jest/globals'

const mockCommand = {
  register: jest.fn(),
}

const mockIpcParentWithNodeForkedProcess = {
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
  mockIpcParentWithNodeForkedProcess.create.mockClear()
  mockIpcParentWithNodeForkedProcess.wrap.mockClear()
  mockHandleIpc.handleIpc.mockClear()
  mockCreateRpc.createRpc.mockClear()
})

jest.unstable_mockModule('../src/parts/Command/Command.js', () => mockCommand)
jest.unstable_mockModule('@lvce-editor/ipc', () => ({
  IpcParentWithNodeForkedProcess: mockIpcParentWithNodeForkedProcess,
}))
jest.unstable_mockModule('../src/parts/HandleIpc/HandleIpc.js', () => mockHandleIpc)
jest.unstable_mockModule('../src/parts/CreateRpc/CreateRpc.js', () => mockCreateRpc)

const { create } = await import('../src/parts/NodeForkedProcessRpcParent/NodeForkedProcessRpcParent.js')

test('create - creates rpc parent with node forked process', async () => {
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
  mockIpcParentWithNodeForkedProcess.create.mockResolvedValue(mockRawIpc)
  mockIpcParentWithNodeForkedProcess.wrap.mockReturnValue(mockIpc)
  mockCreateRpc.createRpc.mockReturnValue(mockRpc)

  const mockCommandMap = { testCommand: jest.fn() }
  const argv = ['node', 'script.js']
  const execArgv = ['--inspect']
  const path = '/path/to/script.js'
  const stdio = 'pipe'
  const env = { NODE_ENV: 'test' }

  const result = await create({
    argv,
    commandMap: mockCommandMap,
    env,
    execArgv,
    path,
    stdio,
  })

  expect(mockCommand.register).toHaveBeenCalledWith(mockCommandMap)
  expect(mockIpcParentWithNodeForkedProcess.create).toHaveBeenCalledWith({
    argv,
    env,
    execArgv,
    path,
    stdio,
  })
  expect(mockIpcParentWithNodeForkedProcess.wrap).toHaveBeenCalledWith(mockRawIpc)
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
  mockIpcParentWithNodeForkedProcess.create.mockResolvedValue(mockRawIpc)
  mockIpcParentWithNodeForkedProcess.wrap.mockReturnValue(mockIpc)
  mockCreateRpc.createRpc.mockReturnValue(mockRpc)

  const mockCommandMap = { testCommand: jest.fn() }
  const path = '/path/to/script.js'

  const result = await create({
    commandMap: mockCommandMap,
    path,
  })

  expect(mockCommand.register).toHaveBeenCalledWith(mockCommandMap)
  expect(mockIpcParentWithNodeForkedProcess.create).toHaveBeenCalledWith({
    argv: undefined,
    env: undefined,
    execArgv: undefined,
    path,
    stdio: undefined,
  })
  expect(mockIpcParentWithNodeForkedProcess.wrap).toHaveBeenCalledWith(mockRawIpc)
  expect(mockHandleIpc.handleIpc).toHaveBeenCalledWith(mockIpc)
  expect(mockCreateRpc.createRpc).toHaveBeenCalledWith(mockIpc)
  expect(result).toBe(mockRpc)
})