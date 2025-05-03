import type { Rpc } from '../Rpc/Rpc.ts'
import * as PlainMessagePortRpc from '../PlainMessagePortRpc/PlainMessagePortRpc.ts'

export const create = async ({
  commandMap,
  messagePort,
}: {
  commandMap: any
  messagePort: MessagePort
}): Promise<Rpc> => {
  return PlainMessagePortRpc.create({
    commandMap,
    messagePort,
  })
}
