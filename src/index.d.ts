export interface Rpc {
  readonly invoke: (method: string, ...params: any[]) => Promise<any>
  readonly invokeAndTransfer: (method: string, ...params: any[]) => Promise<any>
}

export interface RpcClient {
  readonly create: ({ commandMap }: { commandMap: any }) => Promise<Rpc>
}

export const WebWorkerRpcClient: RpcClient
