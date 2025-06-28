interface MockWebSocketRpcResult {
  readonly dispose: () => void
}

export const mockWebSocketRpc = (): MockWebSocketRpcResult => {
  const originalLocation = globalThis.location
  const originalWebSocket = globalThis.WebSocket

  // @ts-ignore
  globalThis.location = {}
  // @ts-ignore
  globalThis.WebSocket = class {
    addEventListener(event: string, fn: any): void {
      if (event === 'open') {
        fn()
      }
    }
    removeEventListener(): void {}
  }
  return {
    dispose(): void {
      globalThis.location = originalLocation
      globalThis.WebSocket = originalWebSocket
    },
  }
}
