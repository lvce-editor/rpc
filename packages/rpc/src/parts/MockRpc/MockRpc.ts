import type { Rpc } from '../Rpc/Rpc.ts'

export const create = ({ invoke, invokeAndTransfer }: { invoke: any; invokeAndTransfer?: any }): Rpc => {
  const mockRpc = {
    invoke,
    invokeAndTransfer,
  } as any
  return mockRpc
}
