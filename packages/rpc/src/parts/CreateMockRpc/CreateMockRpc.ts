import type { Rpc } from '../Rpc/Rpc.ts'

export interface MockRpc extends Rpc {
  readonly invocations: readonly any[]
}

export const createMockRpc = ({ commandMap }: { commandMap?: any }): MockRpc => {
  const invocations: any[] = []
  const invoke = (method: string, ...params: readonly any[]): any => {
    invocations.push([method, ...params])
    const command = commandMap[method]
    if (!command) {
      throw new Error(`command ${method} not found`)
    }
    return command(...params)
  }
  const mockRpc: MockRpc = {
    invocations,
    invoke,
    invokeAndTransfer: invoke,
  } as any
  return mockRpc
}
