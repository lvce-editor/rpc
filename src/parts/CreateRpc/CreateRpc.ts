import * as JsonRpc from '@lvce-editor/json-rpc'
import type { Rpc } from '../Rpc/Rpc.ts'

export const createRpc = (ipc: any): Rpc => {
  const rpc: Rpc = {
    // @ts-ignore
    ipc,
    /**
     * @deprecated
     */
    send(method: string, ...params: any[]): void {
      JsonRpc.send(ipc, method, ...params)
    },
    invoke(method: string, ...params: any[]): Promise<any> {
      return JsonRpc.invoke(ipc, method, ...params)
    },
    invokeAndTransfer(method: string, ...params: any[]): Promise<any> {
      return JsonRpc.invokeAndTransfer(ipc, method, ...params)
    },
    async dispose(): Promise<void> {
      await ipc?.dispose()
    },
  }
  return rpc
}
