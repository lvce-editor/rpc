import { IpcParentWithElectronUtilityProcess } from '@lvce-editor/ipc'
import * as CreateRpc from '../CreateRpc/CreateRpc.ts'
import * as FormatUtilityProcessName from '../FormatUtilityProcessName/FormatUtilityProcessName.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as UtilityProcessState from '../UtilityProcessState/UtilityProcessState.ts'

const { create } = IpcParentWithElectronUtilityProcess

const { wrap } = IpcParentWithElectronUtilityProcess

const effects = ({ name, rawIpc }: { name: string; rawIpc: any }) => {
  if (!rawIpc.pid) {
    return
  }
  const { pid } = rawIpc
  const formattedName = FormatUtilityProcessName.formatUtilityProcessName(name)
  UtilityProcessState.add(pid, rawIpc, formattedName)
  const cleanup = () => {
    UtilityProcessState.remove(pid)
    rawIpc.off('exit', handleExit)
  }
  const handleExit = () => {
    cleanup()
  }
  rawIpc.on('exit', handleExit)
}

export const createUtilityProcessRpc = async ({ env, name }: { env?: any; name: string }) => {
  const rawIpc = await create({
    env,
  })
  effects({ rawIpc, name })
  const ipc = wrap(rawIpc)
  HandleIpc.handleIpc(ipc)
  const rpc = CreateRpc.createRpc(ipc)
  return rpc
}
