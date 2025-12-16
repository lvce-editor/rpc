import { IpcParentWithMessagePort } from '@lvce-editor/ipc'
import type { Rpc } from '../Rpc/Rpc.ts'
import * as Command from '../Command/Command.ts'
import * as CreateRpc from '../CreateRpc/CreateRpc.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.ts'

export const create = async ({
  commandMap,
  isMessagePortOpen = true,
  messagePort,
}: {
  commandMap: any
  messagePort: MessagePort
  isMessagePortOpen?: boolean
}): Promise<Rpc> => {
  // TODO create a commandMap per rpc instance
  Command.register(commandMap)
  const rawIpc = await IpcParentWithMessagePort.create({
    isMessagePortOpen,
    messagePort,
  })
  const ipc = IpcParentWithMessagePort.wrap(rawIpc)
  HandleIpc.handleIpc(ipc)
  const rpc = CreateRpc.createRpc(ipc)
  messagePort.start()
  return rpc
}
