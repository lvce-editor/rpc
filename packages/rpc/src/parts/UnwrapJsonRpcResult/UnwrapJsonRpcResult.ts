import { JsonRpcError } from '../JsonRpcError/JsonRpcError.ts'
import * as RestoreJsonRpcError from '../RestoreJsonRpcError/RestoreJsonRpcError.ts'

export const unwrapJsonRpcResult = <T = unknown>(responseMessage: any): T => {
  if ('error' in responseMessage) {
    const restoredError = RestoreJsonRpcError.restoreJsonRpcError(responseMessage.error)
    throw restoredError
  }
  if ('result' in responseMessage) {
    return responseMessage.result
  }
  throw new JsonRpcError('unexpected response message')
}
