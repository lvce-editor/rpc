export const listen = async (module: any, options?: any): Promise<any> => {
  const rawIpc = await module.listen(options)
  if (module.signal) {
    module.signal(rawIpc)
  }
  const ipc = module.wrap(rawIpc)
  return ipc
}
