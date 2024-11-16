import * as HandleMessage from '../HandleMessage/HandleMessage.ts'

export const handleIpc = (ipc: any): void => {
  ipc.addEventListener('message', HandleMessage.handleMessage)
}
