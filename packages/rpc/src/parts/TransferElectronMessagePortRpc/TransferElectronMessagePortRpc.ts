import type { Rpc } from '../Rpc/Rpc.ts'
import * as ElectronMessagePortRpcClient from '../ElectronMessagePortRpcClient/ElectronMessagePortRpcClient.ts'

export const create = async ({
  commandMap,
  getPortTuple,
  send,
}: {
  commandMap: any
  send: (port: any) => Promise<void>
  getPortTuple: any
}): Promise<Rpc> => {
  const { port1, port2 } = await getPortTuple()
  await send(port1)
  const rpc = ElectronMessagePortRpcClient.create({
    commandMap,
    messagePort: port2,
  })
  return rpc
}
