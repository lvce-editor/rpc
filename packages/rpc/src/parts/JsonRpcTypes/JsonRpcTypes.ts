export interface IJsonRpcRequest<TParams = unknown> {
  readonly id?: number | string
  readonly jsonrpc: '2.0'
  readonly method: string
  readonly params?: TParams
}

export interface JsonRpcEvent<TParams = unknown> {
  readonly jsonrpc: '2.0'
  readonly method: string
  readonly params: TParams
}

interface Transport {
  send(message: unknown): void
  sendAndTransfer?(message: unknown): void
}

export interface IpcConnection extends Transport {
  send(message: unknown): void
  sendAndTransfer?(message: unknown): void
}
