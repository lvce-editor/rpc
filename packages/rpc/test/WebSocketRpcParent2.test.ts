import { test, expect, beforeEach, afterEach, jest } from '@jest/globals'

let originalWebSocket: any

beforeEach(() => {
  originalWebSocket = globalThis.WebSocket
})

afterEach(() => {
  globalThis.WebSocket = originalWebSocket
  jest.resetModules()
})

test('create returns rpc from WebSocketRpcParent', async () => {
  const commandMap = { test: () => 42 }
  const type = 'renderer'

  let wsCreatedWith: string | undefined
  const wsInstance: any = { readyState: 1 }

  // ESM mocking
  jest.unstable_mockModule('../src/parts/Location/Location.ts', () => ({
    getHost: () => 'localhost:8080',
    getProtocol: () => 'ws:',
  }))
  jest.unstable_mockModule('../src/parts/GetWebSocketUrl/GetWebSocketUrl.ts', () => ({
    getWebSocketUrl: (t: string, host: string, protocol: string) => {
      return 'ws://localhost:8080/' + t
    },
  }))
  const fakeRpc = { send: () => {}, invoke: async () => 1, invokeAndTransfer: async () => 2, dispose: async () => {} }
  jest.unstable_mockModule('../src/parts/WebSocketRpcParent/WebSocketRpcParent.ts', () => ({
    create: jest.fn().mockResolvedValue(fakeRpc as unknown as never),
  }))

  // Mock WebSocket
  globalThis.WebSocket = function(url: string) {
    wsCreatedWith = url
    return wsInstance
  } as any

  // Dynamic imports after mocking
  const WebSocketRpcParent2 = await import('../src/parts/WebSocketRpcParent2/WebSocketRpcParent2.ts')
  const WebSocketRpcParent = await import('../src/parts/WebSocketRpcParent/WebSocketRpcParent.ts')
  const GetWebSocketUrl = await import('../src/parts/GetWebSocketUrl/GetWebSocketUrl.ts')
  const Location = await import('../src/parts/Location/Location.ts')

  const rpc = await WebSocketRpcParent2.create({ commandMap, type })

  expect(Location.getHost()).toBe('localhost:8080')
  expect(Location.getProtocol()).toBe('ws:')
  expect(GetWebSocketUrl.getWebSocketUrl(type, 'localhost:8080', 'ws:')).toBe('ws://localhost:8080/renderer')
  expect(wsCreatedWith).toBe('ws://localhost:8080/renderer')
  expect(WebSocketRpcParent.create).toHaveBeenCalledWith({
    webSocket: wsInstance,
    commandMap,
  })
  expect(rpc).toBe(fakeRpc)
})