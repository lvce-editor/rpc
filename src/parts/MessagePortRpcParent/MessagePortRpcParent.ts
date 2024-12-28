import { IpcParentWithMessagePort } from '@lvce-editor/ipc'
import * as Command from '../Command/Command.ts'
import * as CreateRpc from '../CreateRpc/CreateRpc.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import type { Rpc } from '../Rpc/Rpc.ts'

export const create = async ({
  commandMap,
  messagePort,
  isMessagePortOpen,
}: {
  commandMap: any
  messagePort: MessagePort
  isMessagePortOpen?: boolean
}): Promise<Rpc> => {
  // TODO create a commandMap per rpc instance
  Command.register(commandMap)
  const rawIpc = await IpcParentWithMessagePort.create({
    messagePort,
    isMessagePortOpen,
  })
  const ipc = IpcParentWithMessagePort.wrap(rawIpc)
  HandleIpc.handleIpc(ipc)
  const rpc = CreateRpc.createRpc(ipc)
  return rpc
}
