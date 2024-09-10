import * as CreateIpc from '../CreateIpc/CreateIpc.ts'
import * as CreateRpc from '../CreateRpc/CreateRpc.ts'
import * as GetIpcFactory from '../GetIpcFactory/GetIpcFactory.ts'

export const create = async (options: any) => {
  const factory = GetIpcFactory.getIpcFactory(options)
  const ipc = await CreateIpc.createIpc(options, factory)
  const rpc = CreateRpc.createRpc(ipc)
  return rpc
}
