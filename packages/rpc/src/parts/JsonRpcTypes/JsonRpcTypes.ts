export interface IJsonRpcRequest<TParams = unknown> {
  readonly id?: number | string
  readonly jsonrpc: '2.0'
  readonly method: string
  readonly params?: TParams
}

export interface IJsonRpcSuccessResponse<TResult = unknown> {
  readonly id: number | string | null
  readonly jsonrpc: '2.0'
  readonly result: TResult
}

export interface IJsonRpcErrorResponse {
  readonly error: JsonRpcError
  readonly id: number | string | null
  readonly jsonrpc: '2.0'
}

export interface JsonRpcError {
  readonly code: number
  readonly data?: unknown
  readonly message: string
}

export interface JsonRpcEvent<TParams = unknown> {
  readonly jsonrpc: '2.0'
  readonly method: string
  readonly params: TParams
}

export interface Transport {
  send(message: unknown): void
  sendAndTransfer?(message: unknown): void
}

export interface IpcConnection extends Transport {
  send(message: unknown): void
  sendAndTransfer?(message: unknown): void
}

export interface JsonRpcRequestResult<T = unknown> {
  message: IJsonRpcRequest
  promise: Promise<T>
}

export interface ErrorResponseData {
  readonly code?: number | string
  readonly codeFrame?: string
  readonly name?: string
  readonly stack?: string
  readonly type?: string
}
