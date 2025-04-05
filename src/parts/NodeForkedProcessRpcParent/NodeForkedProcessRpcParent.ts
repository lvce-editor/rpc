import { IpcParentWithNodeForkedProcess } from '@lvce-editor/ipc'
import type { Rpc } from '../Rpc/Rpc.ts'
import * as Command from '../Command/Command.ts'
import * as CreateRpc from '../CreateRpc/CreateRpc.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.ts'

export const create = async ({
  commandMap,
  argv,
  execArgv,
}: {
  commandMap: any
  argv?: readonly string[]
  execArgv?: readonly string[]
  isMessagePortOpen?: boolean
}): Promise<Rpc> => {
  // TODO create a commandMap per rpc instance
  Command.register(commandMap)
  const rawIpc = await IpcParentWithNodeForkedProcess.create({
    argv,
    execArgv,
  })
  const ipc = IpcParentWithNodeForkedProcess.wrap(rawIpc)
  HandleIpc.handleIpc(ipc)
  const rpc = CreateRpc.createRpc(ipc)
  return rpc
}
