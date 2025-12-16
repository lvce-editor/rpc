import type { Rpc } from '../Rpc/Rpc.ts'
import * as PlainMessagePortRpc from '../PlainMessagePortRpc/PlainMessagePortRpc.ts'

export const create = async ({
  commandMap,
  isMessagePortOpen,
  send,
}: {
  commandMap: any
  send: (port: MessagePort) => Promise<void>
  isMessagePortOpen?: boolean
}): Promise<Rpc> => {
  const { port1, port2 } = new MessageChannel()
  await send(port1)
  return PlainMessagePortRpc.create({
    commandMap,
    isMessagePortOpen,
    messagePort: port2,
  })
}
