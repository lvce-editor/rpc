import { IpcChildWithElectronMessagePort } from '@lvce-editor/ipc'
import * as Command from '../Command/Command.ts'
import * as CreateRpc from '../CreateRpc/CreateRpc.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as IpcChild from '../IpcChildNode/IpcChildNode.ts'
import type { Rpc } from '../Rpc/Rpc.ts'

export const create = async ({ commandMap, messagePort }: { commandMap: any; messagePort: any }): Promise<Rpc> => {
  // TODO create a commandMap per rpc instance
  Command.register(commandMap)
  const ipc = await IpcChild.listen(IpcChildWithElectronMessagePort, { messagePort })
  HandleIpc.handleIpc(ipc)
  const rpc = CreateRpc.createRpc(ipc)
  return rpc
}
