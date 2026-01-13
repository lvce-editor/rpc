import type { Rpc } from '../Rpc/Rpc.ts'
import { TransferMessagePortRpcParent } from '../Main/Main.ts'
import { createSharedLazyRpc } from '../SharedLazyRpc/SharedLazyRpc.ts'

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
