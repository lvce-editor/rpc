interface Rpc {
  readonly invoke: (method: string, ...params: any[]) => Promise<any>
}

interface RpcClient {
  readonly create: ({ commandMap }: { commandMap: any }) => Promise<Rpc>
}

export const WebWorkerRpcClient: RpcClient
