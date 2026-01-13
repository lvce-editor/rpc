import type { Rpc } from '../Rpc/Rpc.ts'
import { createSharedLazyRpc } from '../SharedLazyRpc/SharedLazyRpc.ts'
import * as TransferElectronMessagePortRpc from '../TransferElectronMessagePortRpc/TransferElectronMessagePortRpc.ts'

export const create = async ({
  commandMap,
  getPortTuple,
  send,
}: {
  commandMap: any
  send: (port: any) => Promise<void>
  getPortTuple?: any
}): Promise<Rpc> => {
  return createSharedLazyRpc(() => {
    return TransferElectronMessagePortRpc.create({
      commandMap,
      getPortTuple,
      send,
    })
  })
}
