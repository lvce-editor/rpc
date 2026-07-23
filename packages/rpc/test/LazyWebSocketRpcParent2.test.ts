import { expect, jest, test } from '@jest/globals'

const invoke = jest.fn(async (): Promise<void> => {})
const create = jest.fn(async () => ({
  dispose: async (): Promise<void> => {},
  invoke,
  invokeAndTransfer: async (): Promise<void> => {},
  send: (): void => {},
}))

jest.unstable_mockModule(
  '../src/parts/WebSocketRpcParent2/WebSocketRpcParent2.js',
  () => ({
    create,
  }),
)

const LazyWebSocketRpcParent2 =
  await import('../src/parts/LazyWebSocketRpcParent2/LazyWebSocketRpcParent2.js')

test('create forwards onClose when the rpc is initialized', async () => {
  const commandMap = {}
  const onClose = jest.fn()
  const rpc = await LazyWebSocketRpcParent2.create({
    commandMap,
    onClose,
    type: 'process-explorer',
  })

  await rpc.invoke('Test.command')

  expect(create).toHaveBeenCalledWith({
    commandMap,
    onClose,
    type: 'process-explorer',
  })
  expect(invoke).toHaveBeenCalledWith('Test.command')
})
