/* eslint-disable unicorn/no-process-exit */
/* eslint-disable unicorn/prefer-top-level-await */
/* eslint-disable n/no-process-exit */
import { NodeWorkerRpcClient } from '@lvce-editor/rpc'

const commandMap = {
  echo: async (data: unknown): Promise<unknown> => {
    return data
  },
  ping: async (message: string): Promise<string> => {
    return `pong: ${message}`
  },
}

const main = async (): Promise<void> => {
  const rpc = await NodeWorkerRpcClient.create({
    commandMap,
  })
  await rpc.invoke('hello', 'from worker')
}

main().catch((error) => {
  console.error('Worker error:', error)
  process.exit(1)
})
