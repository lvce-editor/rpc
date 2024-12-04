// @ts-ignore
import { IpcChildWithModuleWorkerAndMessagePort } from '@lvce-editor/ipc/dist/browser.js'

export const listen = async (): Promise<any> => {
  const module = IpcChildWithModuleWorkerAndMessagePort
  const rawIpc = await module.listen()
  if (module.signal) {
    module.signal(rawIpc)
  }
  const ipc = module.wrap(rawIpc)
  return ipc
}
