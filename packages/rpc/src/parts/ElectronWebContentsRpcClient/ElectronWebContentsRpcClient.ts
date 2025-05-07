import { IpcChildWithRendererProcess2 } from '@lvce-editor/ipc'
import type { Rpc } from '../Rpc/Rpc.ts'
import * as Command from '../Command/Command.ts'
import * as CreateRpc from '../CreateRpc/CreateRpc.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.ts'

export const create = async ({
  commandMap,
  webContents,
  requiresSocket,
}: {
  commandMap: any
  webContents: any
  requiresSocket?: any
}): Promise<Rpc> => {
  // TODO create a commandMap per rpc instance
  Command.register(commandMap)
  const ipc = IpcChildWithRendererProcess2.wrap(webContents)

  if (requiresSocket) {
    // @ts-ignore
    ipc.requiresSocket = requiresSocket
  }
  HandleIpc.handleIpc(ipc)
  const rpc = CreateRpc.createRpc(ipc)
  return rpc
}
