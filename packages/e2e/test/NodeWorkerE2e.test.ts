import { expect, test } from '@jest/globals'
import { NodeWorkerRpcParent } from '@lvce-editor/rpc'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

test('parent and child worker send messages back and forth', async () => {
  const workerPath = join(__dirname, '../src/worker.ts')

  const { promise: helloMessage, resolve: resolveHelloMessage } = Promise.withResolvers<string>()
  const parentCommandMap = {
    hello: async (message: string): Promise<string> => {
      resolveHelloMessage(message)
      return `hello response: ${message}`
    },
  }

  const rpc = await NodeWorkerRpcParent.create({
    commandMap: parentCommandMap,
    path: workerPath,
  })

  const helloMessageReceived = await helloMessage

  // Verify worker sent hello message to parent
  expect(helloMessageReceived).toBe('from worker')

  // Test parent -> child communication
  const pingResult = await rpc.invoke('ping', 'test message')
  expect(pingResult).toBe('pong: test message')

  const echoResult = await rpc.invoke('echo', { test: 'data' })
  expect(echoResult).toEqual({ test: 'data' })

  // Terminate the worker process
  await rpc.dispose()
}, 10_000)
