import * as HandleMessage from '../HandleMessage/HandleMessage.ts'

export const handleIpc = (ipc: any): void => {
  if ('addEventListener' in ipc) {
    ipc.addEventListener('message', HandleMessage.handleMessage)
  } else if ('on' in ipc) {
    // deprecated
    ipc.on('message', HandleMessage.handleMessage)
  }
}

export const unhandleIpc = (ipc: any): void => {
  if ('removeEventListener' in ipc) {
    ipc.removeEventListener('message', HandleMessage.handleMessage)
  } else {
    // deprecated
    ipc.onmessage = null
  }
}
