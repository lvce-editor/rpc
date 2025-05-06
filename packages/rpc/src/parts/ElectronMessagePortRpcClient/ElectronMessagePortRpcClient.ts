import { IpcChildWithElectronMessagePort } from '@lvce-editor/ipc'
import type { Rpc } from '../Rpc/Rpc.ts'
import * as Command from '../Command/Command.ts'
import * as CreateRpc from '../CreateRpc/CreateRpc.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as IpcChild from '../IpcChildNode/IpcChildNode.ts'

export const create = async ({
  commandMap,
  messagePort,
  requiresSocket,
}: {
  commandMap: any
  messagePort: any
  requiresSocket?: any
}): Promise<Rpc> => {
  // TODO create a commandMap per rpc instance
  Command.register(commandMap)
  const ipc = await IpcChild.listen(IpcChildWithElectronMessagePort, { messagePort })
  if (requiresSocket) {
    ipc.requiresSocket = requiresSocket
  }
  HandleIpc.handleIpc(ipc)
  const rpc = CreateRpc.createRpc(ipc)
  return rpc
}
