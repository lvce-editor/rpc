import { handleJsonRpcMessage } from '@lvce-editor/json-rpc'
import * as Command from '../Command/Command.ts'

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

  return handleJsonRpcMessage(
    event.target,
    event.data,
    actualExecute,
    event.target._resolve,
    preparePrettyError,
    logError,
    actualRequiresSocket,
  )
}
