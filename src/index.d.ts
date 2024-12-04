export interface Rpc {
  readonly send: (method: string, ...params: any[]) => void

  readonly invoke: (method: string, ...params: any[]) => Promise<any>

  readonly invokeAndTransfer: (method: string, ...params: any[]) => Promise<any>
}

export interface RpcClientOptions {
  readonly commandMap: any
  readonly [key: string]: any
}

export interface ElectronUtilityProcessRpcClientOptions extends RpcClientOptions {}

export interface ElectronMessagePortRpcClientOptions extends RpcClientOptions {
  readonly messagePort: any
}

export interface WebWorkerRpcClientOptions extends RpcClientOptions {}

export interface NodeWorkerRpcClientOptions extends RpcClientOptions {}

export interface NodeForkedProcessRpcClientOptions extends RpcClientOptions {}

export interface MessagePortRpcParentOptions extends RpcClientOptions {
  readonly messagePort: MessagePort
  readonly isMessagePortOpen?: boolean
}

export interface WebSocketRpcParentOptions extends RpcClientOptions {
  readonly webSocket: WebSocket
}

export interface RpcClient<T extends RpcClientOptions> {
  readonly create: (options: T) => Promise<Rpc>
}

export const ElectronUtilityProcessRpcClient: RpcClient<ElectronUtilityProcessRpcClientOptions>
export const MessagePortRpcParent: RpcClient<MessagePortRpcParentOptions>
export const NodeForkedProcessRpcClient: RpcClient<NodeForkedProcessRpcClientOptions>
export const NodeWorkerRpcClient: RpcClient<NodeWorkerRpcClientOptions>
export const WebSocketRpcParent: RpcClient<WebSocketRpcParentOptions>
export const WebWorkerRpcClient: RpcClient<WebWorkerRpcClientOptions>
