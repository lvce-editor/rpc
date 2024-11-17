export interface Rpc {
  readonly invoke: (method: string, ...params: any[]) => Promise<any>
}

export interface RpcClientOptions {
  commandMap: any
  [key: string]: any
}

export interface RpcClient {
  readonly create: (options: RpcClientOptions) => Promise<Rpc>
}

export const WebWorkerRpcClient: RpcClient
export const MessagePortRpcParent: RpcClient
