import { IpcParentWithElectronUtilityProcess } from '@lvce-editor/ipc'
import type { Rpc } from '../Rpc/Rpc.ts'
import * as Command from '../Command/Command.ts'
import * as CreateRpc from '../CreateRpc/CreateRpc.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.ts'

export const create = async ({
  commandMap,
  env,
  argv,
  execArgv,
  path,
  name,
  requiresSocket,
}: {
  commandMap: any
  env?: any
  argv?: any
  execArgv?: any
  path: string
  name: string
  requiresSocket?: any
}): Promise<Rpc> => {
  // TODO create a commandMap per rpc instance
  Command.register(commandMap)
  const rawIpc = await IpcParentWithElectronUtilityProcess.create({
    env,
    argv,
    execArgv,
    path,
    name,
  })
  const ipc = IpcParentWithElectronUtilityProcess.wrap(rawIpc)
  if (requiresSocket) {
    // @ts-ignore
    ipc.requiresSocket = requiresSocket
  }
  HandleIpc.handleIpc(ipc)
  const rpc = CreateRpc.createRpc(ipc)
  return rpc
}
