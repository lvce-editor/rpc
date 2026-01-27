import type { IJsonRpcRequest } from '../JsonRpcTypes/JsonRpcTypes.ts'
import * as JsonRpcVersion from '../JsonRpcVersion/JsonRpcVersion.ts'

export const create = (id: number, method: string, params: readonly unknown[]): IJsonRpcRequest => {
  const message: IJsonRpcRequest = {
    id,
    jsonrpc: JsonRpcVersion.Two,
    method,
    params,
  }
  return message
}
