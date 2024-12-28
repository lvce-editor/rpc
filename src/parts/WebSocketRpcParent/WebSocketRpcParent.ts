import { IpcParentWithWebSocket } from '@lvce-editor/ipc'
import * as Command from '../Command/Command.ts'
import * as CreateRpc from '../CreateRpc/CreateRpc.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import type { Rpc } from '../Rpc/Rpc.ts'

export const create = async ({ commandMap, webSocket }: { commandMap: any; webSocket: WebSocket }): Promise<Rpc> => {
  // TODO create a commandMap per rpc instance
  Command.register(commandMap)
  const rawIpc = await IpcParentWithWebSocket.create({
    webSocket,
  })
  const ipc = IpcParentWithWebSocket.wrap(rawIpc)
  HandleIpc.handleIpc(ipc)
  const rpc = CreateRpc.createRpc(ipc)
  return rpc
}
