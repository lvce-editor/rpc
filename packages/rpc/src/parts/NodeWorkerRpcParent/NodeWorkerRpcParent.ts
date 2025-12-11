import { IpcParentWithNodeWorker } from '@lvce-editor/ipc'
import type { RpcWithStdio } from '../RpcWithStdio/RpcWithStdio.ts'
import * as Command from '../Command/Command.ts'
import * as CreateRpc from '../CreateRpc/CreateRpc.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.ts'

export const create = async ({
  argv,
  commandMap,
  env,
  execArgv,
  path,
  stdio,
}: {
  commandMap: any
  argv?: readonly string[]
  execArgv?: readonly string[]
  path: string
  stdio?: string
  env?: any
}): Promise<RpcWithStdio> => {
  // TODO create a commandMap per rpc instance
  Command.register(commandMap)
  const rawIpc = await IpcParentWithNodeWorker.create({
    argv,
    env,
    execArgv,
    path,
    stdio,
  })
  const ipc = IpcParentWithNodeWorker.wrap(rawIpc)
  HandleIpc.handleIpc(ipc)
  const rpc = CreateRpc.createRpc(ipc)
  // @ts-ignore
  rpc.stdout = ipc._rawIpc.stdout
  // @ts-ignore
  rpc.stderr = ipc._rawIpc.stderr
  // @ts-ignore
  return rpc
}
