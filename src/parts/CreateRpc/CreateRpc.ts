import * as JsonRpc from '@lvce-editor/json-rpc'

export const createRpc = (ipc: any): any => {
  const rpc = {
    invoke(method: string, ...params: any[]): Promise<any> {
      return JsonRpc.invoke(ipc, method, ...params)
    },
    invokeAndTransfer(method: string, ...params: any[]): Promise<any> {
      return JsonRpc.invokeAndTransfer(ipc, method, ...params)
    },
  }
  return rpc
}
