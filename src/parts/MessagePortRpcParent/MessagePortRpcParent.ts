import * as Command from '../Command/Command.ts'
import * as CreateRpc from '../CreateRpc/CreateRpc.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
// @ts-ignore
import { IpcParentWithMessagePort } from '@lvce-editor/ipc/dist/browser.js'

export const create = async ({
  commandMap,
  messagePort,
}: {
  commandMap: any
  messagePort: MessagePort
}): Promise<any> => {
  // TODO create a commandMap per rpc instance
  Command.register(commandMap)
  const rawIpc = await IpcParentWithMessagePort.create({
    messagePort,
  })
  const ipc = IpcParentWithMessagePort.wrap(rawIpc)
  HandleIpc.handleIpc(ipc)
  const rpc = CreateRpc.createRpc(ipc)
  return rpc
}