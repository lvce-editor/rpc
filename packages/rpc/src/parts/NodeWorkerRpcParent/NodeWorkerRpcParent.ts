import { IpcParentWithNodeWorker } from '@lvce-editor/ipc'
import * as Command from '../Command/Command.ts'
import * as CreateRpc from '../CreateRpc/CreateRpc.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import type { Rpc } from '../Rpc/Rpc.ts'

export const create = async ({
  commandMap,
  argv,
  execArgv,
  path,
  stdio,
  env,
}: {
  commandMap: any
  argv?: readonly string[]
  execArgv?: readonly string[]
  isMessagePortOpen?: boolean
  path: string
  stdio?: string
  env?: any
}): Promise<Rpc> => {
  // TODO create a commandMap per rpc instance
  Command.register(commandMap)
  const rawIpc = await IpcParentWithNodeWorker.create({
    argv,
    execArgv,
    path,
    stdio,
    env,
  })
  const ipc = IpcParentWithNodeWorker.wrap(rawIpc)
  HandleIpc.handleIpc(ipc)
  const rpc = CreateRpc.createRpc(ipc)
  return rpc
}
