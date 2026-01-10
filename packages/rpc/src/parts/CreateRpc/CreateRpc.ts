import type { IpcConnection } from '../JsonRpcTypes/JsonRpcTypes.ts'
import type { Rpc } from '../Rpc/Rpc.ts'
import * as JsonRpcEvent from '../JsonRpcEvent/JsonRpcEvent.ts'
import * as JsonRpcRequest from '../JsonRpcRequest/JsonRpcRequest.ts'
import { registerPromise } from '../RegisterPromise/RegisterPromise.ts'
import * as UnwrapJsonRpcResult from '../UnwrapJsonRpcResult/UnwrapJsonRpcResult.ts'

type Callbacks = Record<number, (value: unknown) => void>

const invokeHelper = async <T>(
  callbacks: Callbacks,
  ipc: IpcConnection,
  method: string,
  params: readonly unknown[],
  useSendAndTransfer: boolean,
): Promise<T> => {
  const { id, promise } = registerPromise(callbacks)
  const message = JsonRpcRequest.create(id, method, params)
  if (useSendAndTransfer && ipc.sendAndTransfer) {
    ipc.sendAndTransfer(message)
  } else {
    ipc.send(message)
  }
  const responseMessage = await promise
  return UnwrapJsonRpcResult.unwrapJsonRpcResult<T>(responseMessage)
}

export const createRpc = (ipc: any): Rpc => {
  const callbacks: Record<number, (value: unknown) => void> = Object.create(null)
  const rpc: Rpc = {
    async dispose(): Promise<void> {
      await ipc?.dispose()
    },
    invoke(method: string, ...params: any[]): Promise<any> {
      return invokeHelper(callbacks, ipc, method, params, false)
    },
    invokeAndTransfer(method: string, ...params: any[]): Promise<any> {
      return invokeHelper(callbacks, ipc, method, params, true)
    },
    // @ts-ignore
    ipc,
    /**
     * @deprecated
     */
    send(method: string, ...params: any[]): void {
      const message = JsonRpcEvent.create(method, params)
      ipc.send(message)
    },
  }
  return rpc
}
