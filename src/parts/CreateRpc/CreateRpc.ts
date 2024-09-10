import * as JsonRpc from '@lvce-editor/json-rpc'

export const createRpc = (ipc: any) => {
  return {
    invoke(method: string, ...params: any[]) {
      return JsonRpc.invoke(ipc, method, ...params)
    },
  }
}
