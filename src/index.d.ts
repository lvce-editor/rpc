export interface Rpc {
  readonly send: (method: string, ...params: any[]) => void

  readonly invoke: (method: string, ...params: any[]) => Promise<any>

  readonly invokeAndTransfer: (method: string, ...params: any[]) => Promise<any>
}

export interface RpcClientOptions {
  readonly commandMap: any
  readonly [key: string]: any
}

export interface WebWorkerRpcClientOptions extends RpcClientOptions {}

export interface MessagePortRpcParentOptions extends RpcClientOptions {
  readonly messagePort: MessagePort
}

export interface WebSocketRpcParentOptions extends RpcClientOptions {
  readonly webSocket: WebSocket
}

export interface RpcClient<T extends RpcClientOptions> {
  readonly create: (options: T) => Promise<Rpc>
}

export const WebWorkerRpcClient: RpcClient<WebWorkerRpcClientOptions>
export const MessagePortRpcParent: RpcClient<MessagePortRpcParentOptions>
export const WebSocketRpcParent: RpcClient<WebSocketRpcParentOptions>
