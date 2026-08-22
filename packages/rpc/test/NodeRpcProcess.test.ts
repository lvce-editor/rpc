import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'
import type { Rpc } from '../src/parts/Rpc/Rpc.ts'

interface RpcClientOptions {
  readonly commandMap: Record<string, (...args: readonly any[]) => any>
  readonly [key: string]: unknown
}

type CreateRpcClient = (options: RpcClientOptions) => Promise<any>

const mockElectronMessagePortRpcClient = {
  create: jest.fn<CreateRpcClient>(),
}

const mockElectronUtilityProcessRpcClient = {
  create: jest.fn<CreateRpcClient>(),
}

const mockNodeForkedProcessRpcClient = {
  create: jest.fn<CreateRpcClient>(),
}

const mockNodeWebSocketRpcClient = {
  create: jest.fn<CreateRpcClient>(),
}

jest.unstable_mockModule(
  '../src/parts/ElectronMessagePortRpcClient/ElectronMessagePortRpcClient.js',
  () => mockElectronMessagePortRpcClient,
)
jest.unstable_mockModule(
  '../src/parts/ElectronUtilityProcessRpcClient/ElectronUtilityProcessRpcClient.js',
  () => mockElectronUtilityProcessRpcClient,
)
jest.unstable_mockModule(
  '../src/parts/NodeForkedProcessRpcClient/NodeForkedProcessRpcClient.js',
  () => mockNodeForkedProcessRpcClient,
)
jest.unstable_mockModule(
  '../src/parts/NodeWebSocketRpcClient/NodeWebSocketRpcClient.js',
  () => mockNodeWebSocketRpcClient,
)

const NodeRpcProcess = await import('../src/parts/NodeRpcProcess/NodeRpcProcess.js')

const originalArgv = process.argv
let originalDisconnectListeners: readonly ((...args: readonly any[]) => void)[] = []

const createMockRpc = (): Rpc => ({
  dispose: jest.fn(async () => {}),
  invoke: jest.fn(async () => {}),
  invokeAndTransfer: jest.fn(async () => {}),
  send: jest.fn(),
})

beforeEach(() => {
  originalDisconnectListeners = process.listeners('disconnect')
  process.argv = ['node', 'main.js', '--ipc-type=electron-utility-process']
  mockElectronMessagePortRpcClient.create.mockReset()
  mockElectronUtilityProcessRpcClient.create.mockReset()
  mockNodeForkedProcessRpcClient.create.mockReset()
  mockNodeWebSocketRpcClient.create.mockReset()
})

afterEach(() => {
  process.argv = originalArgv
  for (const listener of process.listeners('disconnect')) {
    if (!originalDisconnectListeners.includes(listener)) {
      process.off('disconnect', listener)
    }
  }
})

test('creates an Electron utility process control rpc', async () => {
  const parentRpc = createMockRpc()
  mockElectronUtilityProcessRpcClient.create.mockResolvedValue(parentRpc)

  const result = await NodeRpcProcess.create({ commandMap: { 'Test.run': jest.fn() } })

  expect(result).toBe(parentRpc)
  expect(mockElectronUtilityProcessRpcClient.create).toHaveBeenCalledWith({ commandMap: expect.any(Object) })
  expect(mockNodeForkedProcessRpcClient.create).not.toHaveBeenCalled()
})

test('creates a Node forked process control rpc', async () => {
  process.argv = ['node', 'main.js', '--ipc-type=node-forked-process']
  const parentRpc = createMockRpc()
  mockNodeForkedProcessRpcClient.create.mockResolvedValue(parentRpc)

  const result = await NodeRpcProcess.create({ commandMap: { 'Test.run': jest.fn() } })

  expect(result).toBe(parentRpc)
  expect(mockNodeForkedProcessRpcClient.create).toHaveBeenCalledWith({ commandMap: expect.any(Object) })
  expect(mockElectronUtilityProcessRpcClient.create).not.toHaveBeenCalled()
})

test('attaches an Electron message port to the extension command map', async () => {
  const extensionCommandMap = { 'Test.run': jest.fn() }
  const parentRpc = createMockRpc()
  const extensionRpc = createMockRpc()
  mockElectronUtilityProcessRpcClient.create.mockResolvedValue(parentRpc)
  mockElectronMessagePortRpcClient.create.mockResolvedValue(extensionRpc)
  await NodeRpcProcess.create({ commandMap: extensionCommandMap })
  const [{ commandMap }] = mockElectronUtilityProcessRpcClient.create.mock.calls[0]
  const messagePort = {} as MessagePort

  await commandMap['NodeRpcProcess.handleElectronMessagePort'](messagePort)

  expect(mockElectronMessagePortRpcClient.create).toHaveBeenCalledWith({ commandMap: extensionCommandMap, messagePort })
})

test('attaches a WebSocket to the extension command map', async () => {
  const extensionCommandMap = { 'Test.run': jest.fn() }
  const parentRpc = createMockRpc()
  const extensionRpc = createMockRpc()
  mockNodeForkedProcessRpcClient.create.mockResolvedValue(parentRpc)
  mockNodeWebSocketRpcClient.create.mockResolvedValue(extensionRpc)
  process.argv = ['node', 'main.js', '--ipc-type=node-forked-process']
  await NodeRpcProcess.create({ commandMap: extensionCommandMap })
  const [{ commandMap }] = mockNodeForkedProcessRpcClient.create.mock.calls[0]
  const handle = {}
  const request = {}

  await commandMap['NodeRpcProcess.handleWebSocket'](handle, request)

  expect(mockNodeWebSocketRpcClient.create).toHaveBeenCalledWith({ commandMap: extensionCommandMap, handle, request })
})

test('rejects a second extension connection', async () => {
  const parentRpc = createMockRpc()
  mockElectronUtilityProcessRpcClient.create.mockResolvedValue(parentRpc)
  mockElectronMessagePortRpcClient.create.mockResolvedValue(createMockRpc())
  await NodeRpcProcess.create({ commandMap: {} })
  const [{ commandMap }] = mockElectronUtilityProcessRpcClient.create.mock.calls[0]

  await commandMap['NodeRpcProcess.handleElectronMessagePort']({})

  await expect(commandMap['NodeRpcProcess.handleElectronMessagePort']({})).rejects.toThrow(
    'Node rpc process already has a connection',
  )
})

test('allows retrying after extension connection setup fails', async () => {
  const parentRpc = createMockRpc()
  mockElectronUtilityProcessRpcClient.create.mockResolvedValue(parentRpc)
  mockElectronMessagePortRpcClient.create
    .mockRejectedValueOnce(new Error('connection failed'))
    .mockResolvedValueOnce(createMockRpc())
  await NodeRpcProcess.create({ commandMap: {} })
  const [{ commandMap }] = mockElectronUtilityProcessRpcClient.create.mock.calls[0]

  await expect(commandMap['NodeRpcProcess.handleElectronMessagePort']({})).rejects.toThrow('connection failed')

  await expect(commandMap['NodeRpcProcess.handleElectronMessagePort']({})).resolves.toBeUndefined()
})

test('exits when the extension connection closes', async () => {
  const addEventListener = jest.fn<(event: string, listener: () => void) => void>()
  const exitSpy = jest.spyOn(process, 'exit').mockImplementation((() => undefined) as never)
  mockElectronUtilityProcessRpcClient.create.mockResolvedValue(createMockRpc())
  mockElectronMessagePortRpcClient.create.mockResolvedValue({
    ...createMockRpc(),
    ipc: { addEventListener },
  })
  await NodeRpcProcess.create({ commandMap: {} })
  const [{ commandMap }] = mockElectronUtilityProcessRpcClient.create.mock.calls[0]
  await commandMap['NodeRpcProcess.handleElectronMessagePort']({})
  const [, handleClose] = addEventListener.mock.calls[0]

  handleClose()

  expect(exitSpy).toHaveBeenCalledWith(0)
  exitSpy.mockRestore()
})

test('exits when the parent disconnects', async () => {
  const exitSpy = jest.spyOn(process, 'exit').mockImplementation((() => undefined) as never)
  mockElectronUtilityProcessRpcClient.create.mockResolvedValue(createMockRpc())
  await NodeRpcProcess.create({ commandMap: {} })

  process.emit('disconnect')

  expect(exitSpy).toHaveBeenCalledWith(0)
  exitSpy.mockRestore()
})

test('propagates parent connection failures', async () => {
  mockElectronUtilityProcessRpcClient.create.mockRejectedValue(new Error('parent failed'))

  await expect(NodeRpcProcess.create({ commandMap: {} })).rejects.toThrow('parent failed')
})

test('rejects unknown process transports', async () => {
  process.argv = ['node', 'main.js']

  await expect(NodeRpcProcess.create({ commandMap: {} })).rejects.toThrow('[node-rpc-process] unknown ipc type')
})
