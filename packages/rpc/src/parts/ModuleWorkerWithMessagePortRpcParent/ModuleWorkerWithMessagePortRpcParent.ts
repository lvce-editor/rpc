import { IpcParentWithModuleWorker } from '@lvce-editor/ipc'
import type { Rpc } from '../Rpc/Rpc.ts'
import * as Command from '../Command/Command.ts'
import { createRpc } from '../CreateRpc/CreateRpc.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as IsWorker from '../IsWorker/IsWorker.ts'

export const create = async ({
  commandMap,
  url,
  port,
  name,
}: {
  commandMap: any
  url: string
  port: MessagePort
  name?: string
}): Promise<Rpc> => {
  // TODO create a commandMap per rpc instance
  Command.register(commandMap)
  const worker = await IpcParentWithModuleWorker.create({
    url,
    name,
  })
  if (!IsWorker.isWorker(worker)) {
    throw new Error(`worker must be of type Worker`)
  }
  const ipc = IpcParentWithModuleWorker.wrap(worker)
  HandleIpc.handleIpc(ipc)
  const workerRpc = createRpc(ipc)
  await workerRpc.invokeAndTransfer('initialize', 'message-port', port)
  HandleIpc.unhandleIpc(ipc)
  return workerRpc
}
