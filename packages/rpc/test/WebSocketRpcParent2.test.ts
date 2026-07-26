import { test, expect, beforeEach, afterEach, jest } from '@jest/globals'

let originalWebSocket: any

beforeEach(() => {
  originalWebSocket = globalThis.WebSocket
})

afterEach(() => {
  globalThis.WebSocket = originalWebSocket
  jest.useRealTimers()
  jest.resetModules()
})

test('create returns rpc from WebSocketRpcParent', async () => {
  const commandMap = { test: (): number => 42 }
  const type = 'renderer'

  let wsCreatedWith: string | undefined
  const addEventListener = jest.fn()
  const wsInstance: any = {
    addEventListener,
    readyState: 1,
  }
  const onClose = jest.fn()

  // ESM mocking
  jest.unstable_mockModule('../src/parts/Location/Location.js', () => ({
    getHost: (): string => 'localhost:8080',
    getProtocol: (): string => 'ws:',
  }))
  jest.unstable_mockModule('../src/parts/GetWebSocketUrl/GetWebSocketUrl.js', () => ({
    getWebSocketUrl: (t: string, host: string, protocol: string): string => {
      return 'ws://localhost:8080/' + t
    },
  }))
  const fakeRpc = {
    dispose: async (): Promise<void> => {},
    invoke: async (): Promise<any> => 1,
    invokeAndTransfer: async (): Promise<any> => 2,
    send: (): void => {},
  }
  jest.unstable_mockModule('../src/parts/WebSocketRpcParent/WebSocketRpcParent.js', () => ({
    create: jest.fn().mockResolvedValue(fakeRpc as unknown as never),
  }))

  // Mock WebSocket
  globalThis.WebSocket = function (url: string) {
    wsCreatedWith = url
    return wsInstance
  } as any

  // Dynamic imports after mocking
  const WebSocketRpcParent2 = await import('../src/parts/WebSocketRpcParent2/WebSocketRpcParent2.js')
  const WebSocketRpcParent = await import('../src/parts/WebSocketRpcParent/WebSocketRpcParent.js')
  const GetWebSocketUrl = await import('../src/parts/GetWebSocketUrl/GetWebSocketUrl.js')
  const Location = await import('../src/parts/Location/Location.js')

  const rpc = await WebSocketRpcParent2.create({ commandMap, onClose, type })

  expect(Location.getHost()).toBe('localhost:8080')
  expect(Location.getProtocol()).toBe('ws:')
  expect(GetWebSocketUrl.getWebSocketUrl(type, 'localhost:8080', 'ws:')).toBe('ws://localhost:8080/renderer')
  expect(wsCreatedWith).toBe('ws://localhost:8080/renderer')
  expect(addEventListener).toHaveBeenCalledWith('close', onClose, {
    once: true,
  })
  expect(WebSocketRpcParent.create).toHaveBeenCalledWith({
    commandMap,
    webSocket: wsInstance,
  })
  expect(rpc).toBe(fakeRpc)

  const closeListener = addEventListener.mock.calls[0][1] as () => void
  closeListener()
  expect(onClose).toHaveBeenCalledTimes(1)
})

test('retries once when the initial websocket connection fails', async () => {
  jest.useFakeTimers()

  const commandMap = { test: (): number => 42 }
  const type = 'renderer'
  const firstWebSocket = {
    addEventListener: jest.fn(),
    close: jest.fn(),
  }
  const secondWebSocket = {
    addEventListener: jest.fn(),
    close: jest.fn(),
  }
  const webSockets = [firstWebSocket, secondWebSocket]
  const onClose = jest.fn()

  jest.unstable_mockModule('../src/parts/Location/Location.js', () => ({
    getHost: (): string => 'localhost:8080',
    getProtocol: (): string => 'ws:',
  }))
  jest.unstable_mockModule('../src/parts/GetWebSocketUrl/GetWebSocketUrl.js', () => ({
    getWebSocketUrl: (currentType: string): string => {
      return 'ws://localhost:8080/' + currentType
    },
  }))
  const fakeRpc = {
    dispose: async (): Promise<void> => {},
    invoke: async (): Promise<any> => 1,
    invokeAndTransfer: async (): Promise<any> => 2,
    send: (): void => {},
  }
  const createRpc = jest.fn().mockRejectedValueOnce(new Error('WebSocket connection error') as never).mockResolvedValueOnce(fakeRpc as never)
  jest.unstable_mockModule('../src/parts/WebSocketRpcParent/WebSocketRpcParent.js', () => ({
    create: createRpc,
  }))

  globalThis.WebSocket = function () {
    return webSockets.shift()
  } as any

  const WebSocketRpcParent2 = await import('../src/parts/WebSocketRpcParent2/WebSocketRpcParent2.js')

  const rpcPromise = WebSocketRpcParent2.create({
    commandMap,
    onClose,
    type,
  })
  await jest.advanceTimersByTimeAsync(2000)

  await expect(rpcPromise).resolves.toBe(fakeRpc)
  expect(createRpc).toHaveBeenCalledTimes(2)
  expect(firstWebSocket.close).toHaveBeenCalledTimes(1)
  expect(firstWebSocket.addEventListener).not.toHaveBeenCalled()
  expect(secondWebSocket.addEventListener).toHaveBeenCalledWith('close', onClose, {
    once: true,
  })
})
