export interface Rpc {
  readonly send: (method: string, ...params: any[]) => void

  readonly invoke: (method: string, ...params: any[]) => Promise<any>

  readonly invokeAndTransfer: (method: string, ...params: any[]) => Promise<any>
}

export interface RpcClientOptions {
  readonly commandMap: any
  readonly [key: string]: any
}

export interface RpcClient {
  readonly create: (options: RpcClientOptions) => Promise<Rpc>
}

export const WebWorkerRpcClient: RpcClient
export const MessagePortRpcParent: RpcClient
export const WebSocketRpcParent: RpcClient
