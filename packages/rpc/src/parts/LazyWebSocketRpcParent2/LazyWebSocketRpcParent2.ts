import type { Rpc } from '../Rpc/Rpc.ts'
import { createSharedLazyRpc } from '../SharedLazyRpc/SharedLazyRpc.ts'
import * as WebSocketRpcParent2 from '../WebSocketRpcParent2/WebSocketRpcParent2.ts'

export const create = async ({
  commandMap,
  onClose,
  type,
}: {
  commandMap: any
  onClose?: () => void
  type: string
}): Promise<Rpc> => {
  return createSharedLazyRpc(() => {
    return WebSocketRpcParent2.create({
      commandMap,
      onClose,
      type,
    })
  })
}
