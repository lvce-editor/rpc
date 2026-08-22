import type { Rpc } from '../Rpc/Rpc.ts'
import * as ElectronMessagePortRpcClient from '../ElectronMessagePortRpcClient/ElectronMessagePortRpcClient.ts'
import * as ElectronUtilityProcessRpcClient from '../ElectronUtilityProcessRpcClient/ElectronUtilityProcessRpcClient.ts'
import * as NodeForkedProcessRpcClient from '../NodeForkedProcessRpcClient/NodeForkedProcessRpcClient.ts'
import * as NodeWebSocketRpcClient from '../NodeWebSocketRpcClient/NodeWebSocketRpcClient.ts'

interface CreateOptions {
  readonly commandMap: Record<string, unknown>
}

interface RpcWithIpc extends Rpc {
  readonly ipc?: {
    readonly addEventListener?: (event: string, listener: () => void) => void
    readonly once?: (event: string, listener: () => void) => void
  }
}

const electronUtilityProcessType = '--ipc-type=electron-utility-process'
const nodeForkedProcessType = '--ipc-type=node-forked-process'

const exit = (): void => {
  // eslint-disable-next-line n/no-process-exit, unicorn/no-process-exit
  process.exit(0)
}

const exitWhenClosed = (rpc: RpcWithIpc): void => {
  const { ipc } = rpc
  if (ipc?.addEventListener) {
    ipc.addEventListener('close', exit)
  } else if (ipc?.once) {
    ipc.once('close', exit)
  }
}

const getParentRpcFactory = (argv: readonly string[]): typeof ElectronUtilityProcessRpcClient.create => {
  if (argv.includes(electronUtilityProcessType)) {
    return ElectronUtilityProcessRpcClient.create
  }
  if (argv.includes(nodeForkedProcessType)) {
    return NodeForkedProcessRpcClient.create
  }
  throw new Error('[node-rpc-process] unknown ipc type')
}

export const create = async ({ commandMap }: CreateOptions): Promise<Rpc> => {
  let attached = false

  const attach = async (createRpc: () => Promise<Rpc>): Promise<void> => {
    if (attached) {
      throw new Error('Node rpc process already has a connection')
    }
    attached = true
    try {
      const rpc = (await createRpc()) as RpcWithIpc
      exitWhenClosed(rpc)
    } catch (error) {
      attached = false
      throw error
    }
  }

  const parentCommandMap = {
    'NodeRpcProcess.handleElectronMessagePort'(messagePort: MessagePort): Promise<void> {
      return attach(() => ElectronMessagePortRpcClient.create({ commandMap, messagePort }))
    },
    'NodeRpcProcess.handleWebSocket'(handle: unknown, request: unknown): Promise<void> {
      return attach(() => NodeWebSocketRpcClient.create({ commandMap, handle, request }))
    },
  }

  process.once('disconnect', exit)
  try {
    const createParentRpc = getParentRpcFactory(process.argv)
    return await createParentRpc({ commandMap: parentCommandMap })
  } catch (error) {
    process.off('disconnect', exit)
    throw error
  }
}
