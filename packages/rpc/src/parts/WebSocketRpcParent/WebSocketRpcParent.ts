import { IpcParentWithWebSocket } from '@lvce-editor/ipc'
import { VError } from '@lvce-editor/verror'
import type { Rpc } from '../Rpc/Rpc.ts'
import * as Command from '../Command/Command.ts'
import * as CreateRpc from '../CreateRpc/CreateRpc.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.ts'

export const create = async ({ commandMap, webSocket }: { commandMap: any; webSocket: WebSocket }): Promise<Rpc> => {
  // TODO create a commandMap per rpc instance
  Command.register(commandMap)
  let rawIpc: any
  try {
    rawIpc = await IpcParentWithWebSocket.create({
      webSocket,
    })
  } catch (error) {
    throw new VError(error, 'Failed to create rpc connection')
  }
  const ipc = IpcParentWithWebSocket.wrap(rawIpc)
  HandleIpc.handleIpc(ipc)
  const rpc = CreateRpc.createRpc(ipc)
  return rpc
}
