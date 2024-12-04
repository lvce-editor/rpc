export const listen = async (module: any): Promise<any> => {
  const rawIpc = await module.listen()
  if (module.signal) {
    module.signal(rawIpc)
  }
  const ipc = module.wrap(rawIpc)
  return ipc
}
