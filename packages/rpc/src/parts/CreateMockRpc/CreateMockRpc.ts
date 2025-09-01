import type { Rpc } from '../Rpc/Rpc.ts'

export interface MockRpc extends Rpc {
  readonly invocations: readonly any[]
}

export const createMockRpc = ({ commandMap }: { commandMap?: any }): MockRpc => {
  const invocations: any[] = []
  const invoke = (method: string, ...params: readonly any[]) => {
    invocations.push(method, ...params)
    const command = commandMap[method]
    return command(...params)
  }
  const mockRpc: MockRpc = {
    invoke,
    invokeAndTransfer: invoke,
  } as any
  return mockRpc
}
