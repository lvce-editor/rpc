import type { Rpc } from '../Rpc/Rpc.ts'
import { createSharedLazyRpc } from '../SharedLazyRpc/SharedLazyRpc.ts'
import * as TransferMessagePortRpcParent from '../TransferMessagePortRpcParent/TransferMessagePortRpcParent.ts'

export const create = async ({
  commandMap,
  isMessagePortOpen,
  send,
}: {
  commandMap: any
  send: (port: MessagePort) => Promise<void>
  isMessagePortOpen?: boolean
}): Promise<Rpc> => {
  return createSharedLazyRpc(() => {
    return TransferMessagePortRpcParent.create({
      commandMap,
      isMessagePortOpen,
      send,
    })
  })
}
