interface MockWorkerGlobalRpcResult {
  readonly start: () => void
  readonly dispose: () => void
}

export const mockWorkerGlobalRpc = (): MockWorkerGlobalRpcResult => {
  const originalOnMessage = globalThis.onmessage
  const originalPostMessage = globalThis.postMessage
  const originalWorkerGlobalScope = globalThis.WorkerGlobalScope

  let onMessageListener: ((event: MessageEvent) => void) | undefined

  // Set up the onmessage handler
  globalThis.onmessage = (event: MessageEvent): void => {
    if (onMessageListener) {
      onMessageListener(event)
    }
  }

  // Mock addEventListener to capture the listener
  globalThis.addEventListener = (type: string, listener: EventListenerOrEventListenerObject): void => {
    if (type === 'message') {
      onMessageListener = listener as (event: MessageEvent) => void
    }
  }

  // @ts-ignore
  globalThis.WorkerGlobalScope = {}
  const { port1, port2 } = new MessageChannel()
  return {
    start(): void {
      const messageEvent = new MessageEvent('message', {
        data: {
          jsonrpc: '2.0',
          method: 'initialize',
          params: ['message-port', port2],
        },
        ports: [port2],
      })

      if (onMessageListener) {
        onMessageListener(messageEvent)
      }
    },
    dispose(): void {
      port1.close()
      port2.close()
      globalThis.onmessage = originalOnMessage
      globalThis.postMessage = originalPostMessage
      globalThis.WorkerGlobalScope = originalWorkerGlobalScope
    },
  }
}
