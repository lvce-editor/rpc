import { IpcChildWithWebSocket } from '@lvce-editor/ipc'
import type { Rpc } from '../Rpc/Rpc.ts'
import * as Command from '../Command/Command.ts'
import * as CreateRpc from '../CreateRpc/CreateRpc.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as IpcChild from '../IpcChildNode/IpcChildNode.ts'

export const create = async ({
  commandMap,
  handle,
  request,
  requiresSocket,
}: {
  commandMap: any
  request: any
  handle: any
  requiresSocket?: any
}): Promise<Rpc> => {
  // TODO create a commandMap per rpc instance
  Command.register(commandMap)
  const ipc = await IpcChild.listen(IpcChildWithWebSocket, { handle, request })
  if (requiresSocket) {
    ipc.requiresSocket = requiresSocket
  }
  HandleIpc.handleIpc(ipc)
  const rpc = CreateRpc.createRpc(ipc)
  return rpc
}
