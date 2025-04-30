import type { Rpc } from '../Rpc/Rpc.ts'

export const create = ({
  commandMap,
  invoke,
  invokeAndTransfer,
}: {
  invoke: any
  invokeAndTransfer?: any
  commandMap?: any
}): Rpc => {
  const mockRpc = {
    invoke,
    invokeAndTransfer,
  } as any
  return mockRpc
}
