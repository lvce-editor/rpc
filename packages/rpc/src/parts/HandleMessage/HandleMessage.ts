import * as Callback from '../Callback/Callback.ts'
import * as Command from '../Command/Command.ts'
import * as HandleJsonRpcMessage from '../JsonRpc/JsonRpc.ts'

const requiresSocket = (): boolean => {
  return false
}

const preparePrettyError = (error: any): any => {
  return error
}

const logError = (): void => {
  // handled by renderer worker
}

export const handleMessage = (event: any): Promise<void> => {
  const actualRequiresSocket = event?.target?.requiresSocket || requiresSocket
  const actualExecute = event?.target?.execute || Command.execute
  return HandleJsonRpcMessage.handleJsonRpcMessage(
    event.target,
    event.data,
    actualExecute,
    Callback.resolve,
    preparePrettyError,
    logError,
    actualRequiresSocket,
  )
}
