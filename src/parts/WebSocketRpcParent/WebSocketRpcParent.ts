import * as Command from '../Command/Command.ts'
import * as CreateRpc from '../CreateRpc/CreateRpc.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
// @ts-ignore
import { IpcParentWithWebSocket } from '@lvce-editor/ipc/dist/browser.js'

export const create = async ({
  commandMap,
  webSocketUrl
}: {
  commandMap: any,
  webSocketUrl:string
}): Promise<any> => {
  // TODO create a commandMap per rpc instance
  Command.register(commandMap)
  const rawIpc = await IpcParentWithWebSocket.create({
    webSocketUrl
  })
  const ipc = IpcParentWithWebSocket.wrap(rawIpc)
  HandleIpc.handleIpc(ipc)
  const rpc = CreateRpc.createRpc(ipc)
  return rpc
}