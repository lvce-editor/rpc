export const createIpc = async (options: any, factory: any) => {
  const rawIpc = await factory.listen(options)
  const ipc = factory.wrap(rawIpc)
  return ipc
}
