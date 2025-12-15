import type { Rpc } from '../Rpc/Rpc.ts'
import * as PlainMessagePortRpc from '../PlainMessagePortRpc/PlainMessagePortRpc.ts'

export const create = async ({
  commandMap,
  send,
  isMessagePortOpen,
}: {
  commandMap: any
  send: (port: MessagePort) => Promise<void>
  isMessagePortOpen?: boolean
}): Promise<Rpc> => {
  const { port1, port2 } = new MessageChannel()
  await send(port1)
  return PlainMessagePortRpc.create({
    commandMap,
    messagePort: port2,
    isMessagePortOpen,
  })
}
