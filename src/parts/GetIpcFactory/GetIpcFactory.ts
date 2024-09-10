import { IpcChildWithElectronMessagePort } from '@lvce-editor/ipc'

export const getIpcFactory = (options: any) => {
  switch (options.ipcMethod) {
    case 'IpcChildWithElectronMessagePort':
      return IpcChildWithElectronMessagePort
    default:
      throw new Error(`unsupported ipc method`)
  }
}
