/* eslint-disable @typescript-eslint/no-misused-promises */
import type { Rpc } from '../Rpc/Rpc.ts'
import { TransferMessagePortRpcParent } from '../Main/Main.ts'

export const create = async ({
  commandMap,
  isMessagePortOpen,
  send,
}: {
  commandMap: any
  send: (port: MessagePort) => Promise<void>
  isMessagePortOpen?: boolean
}): Promise<Rpc> => {
  let rpcPromise: Promise<Rpc> | undefined
  const getOrCreate = () => {
    if (!rpcPromise) {
      rpcPromise = TransferMessagePortRpcParent.create({
        commandMap,
        isMessagePortOpen,
        send,
      })
    }
    return rpcPromise
  }
  return {
    async dispose(): Promise<void> {
      const rpc = await getOrCreate()
      await rpc.dispose()
    },
    async invoke(method, ...params): Promise<any> {
      const rpc = await getOrCreate()
      return rpc.invoke(method, ...params)
    },
    async invokeAndTransfer(method, ...params): Promise<any> {
      const rpc = await getOrCreate()
      return rpc.invokeAndTransfer(method, ...params)
    },
    async send(method, ...params): Promise<void> {
      const rpc = await getOrCreate()
      rpc.send(method, ...params)
    },
  }
}
